"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Trade = { date: string; pnl: number; direction: string; respected_rules: boolean; emotion: string; pair: string; };
type Checkin = { date: string; score: number; };

function fmt(d: Date) { return d.toISOString().split("T")[0]; }

function getMonthBounds(offset: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end, year: d.getFullYear(), month: d.getMonth() };
}

export default function RapportMensuelPage() {
  const router = useRouter();
  const supabase = createClient();

  const [monthOffset, setMonthOffset] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [accountSize, setAccountSize] = useState<number | null>(null);
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);

  const { start, end, year, month } = getMonthBounds(monthOffset);

  useEffect(() => { load(); }, [monthOffset]);

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const [{ data: t }, { data: c }, { data: profile }] = await Promise.all([
      supabase.from("trades").select("date,pnl,direction,respected_rules,emotion,pair").eq("user_id", user.id).gte("date", fmt(start)).lte("date", fmt(end)),
      supabase.from("checkins").select("date,score").eq("user_id", user.id).gte("date", fmt(start)).lte("date", fmt(end)),
      supabase.from("profiles").select("account_size,currency").eq("id", user.id).single(),
    ]);
    setTrades(t || []);
    setCheckins(c || []);
    if (profile?.account_size) setAccountSize(profile.account_size);
    if (profile?.currency) setCurrency(profile.currency);
    setLoading(false);
  }

  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const total = trades.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : null;
  const pnlNet = trades.reduce((s, t) => s + t.pnl, 0);
  const rulesOk = total > 0 ? Math.round((trades.filter(t => t.respected_rules).length / total) * 100) : null;
  const avgScore = checkins.length > 0 ? Math.round(checkins.reduce((s, c) => s + c.score, 0) / checkins.length) : null;
  const winsSum = trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
  const lossSum = Math.abs(trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
  const profitFactor = total === 0 ? null : lossSum === 0 ? "∞" : (winsSum / lossSum).toFixed(2);
  const pfNum = profitFactor === null ? null : profitFactor === "∞" ? Infinity : parseFloat(profitFactor as string);

  const bestTrade = [...trades].sort((a, b) => b.pnl - a.pnl)[0] || null;
  const worstTrade = [...trades].sort((a, b) => a.pnl - b.pnl)[0] || null;

  // Emotion breakdown
  const emotionMap: Record<string, { count: number; pnl: number }> = {};
  trades.forEach(t => {
    if (!emotionMap[t.emotion]) emotionMap[t.emotion] = { count: 0, pnl: 0 };
    emotionMap[t.emotion].count++;
    emotionMap[t.emotion].pnl += t.pnl;
  });
  const topEmotions = Object.entries(emotionMap).sort((a, b) => b[1].count - a[1].count).slice(0, 4);

  // Weekly breakdown
  const weeks: { label: string; pnl: number; trades: number; score: number | null }[] = [];
  const firstDay = new Date(start);
  while (firstDay.getDay() !== 1) firstDay.setDate(firstDay.getDate() - 1);
  for (let i = 0; i < 6; i++) {
    const wStart = new Date(firstDay);
    wStart.setDate(firstDay.getDate() + i * 7);
    const wEnd = new Date(wStart);
    wEnd.setDate(wStart.getDate() + 6);
    if (wStart > end) break;
    const wTrades = trades.filter(t => t.date >= fmt(wStart) && t.date <= fmt(wEnd));
    const wCheckins = checkins.filter(c => c.date >= fmt(wStart) && c.date <= fmt(wEnd));
    const wPnl = wTrades.reduce((s, t) => s + t.pnl, 0);
    const wScore = wCheckins.length > 0 ? Math.round(wCheckins.reduce((s, c) => s + c.score, 0) / wCheckins.length) : null;
    weeks.push({
      label: `S${i + 1}`,
      pnl: wPnl,
      trades: wTrades.length,
      score: wScore,
    });
  }
  const maxAbsPnl = Math.max(...weeks.map(w => Math.abs(w.pnl)), 1);

  // Correlation score/P&L
  const highDays = checkins.filter(c => c.score >= 75).map(c => trades.filter(t => t.date === c.date).reduce((s, t) => s + t.pnl, 0));
  const midDays  = checkins.filter(c => c.score >= 60 && c.score < 75).map(c => trades.filter(t => t.date === c.date).reduce((s, t) => s + t.pnl, 0));
  const lowDays  = checkins.filter(c => c.score < 60).map(c => trades.filter(t => t.date === c.date).reduce((s, t) => s + t.pnl, 0));
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const avgPnlHigh = avg(highDays);
  const avgPnlMid  = avg(midDays);
  const avgPnlLow  = avg(lowDays);

  // Insights
  const insights: { type: "good" | "warn" | "info"; text: string }[] = [];
  if (winRate !== null && winRate >= 60) insights.push({ type: "good", text: `Win rate de ${winRate}% ce mois — au-dessus de la moyenne.` });
  if (winRate !== null && winRate < 40) insights.push({ type: "warn", text: `Win rate de ${winRate}% ce mois — analyse tes entrées perdantes.` });
  if (rulesOk !== null && rulesOk < 70) insights.push({ type: "warn", text: `Règles respectées à ${rulesOk}% — la discipline reste ton levier principal.` });
  if (rulesOk !== null && rulesOk === 100) insights.push({ type: "good", text: "100% des règles respectées ce mois — discipline parfaite." });
  if (avgScore !== null && avgScore < 60) insights.push({ type: "warn", text: `Score mental moyen de ${avgScore}/100 — ton état a impacté tes décisions ce mois.` });
  if (avgScore !== null && avgScore >= 75) insights.push({ type: "good", text: `Score mental moyen de ${avgScore}/100 — conditions optimales maintenues.` });
  if (pfNum !== null && pfNum < 1) insights.push({ type: "warn", text: `Profit factor de ${profitFactor} — tes pertes dépassent tes gains ce mois.` });
  if (pfNum !== null && pfNum >= 2) insights.push({ type: "good", text: `Profit factor de ${profitFactor} — excellente rentabilité ce mois.` });
  if (checkins.length < 10 && total > 0) insights.push({ type: "info", text: `Seulement ${checkins.length} check-ins ce mois — le suivi mental est incomplet.` });

  const monthLabel = new Date(year, month, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const isCurrentMonth = monthOffset === 0;

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Rapport mensuel</div>
          <div style={{ fontSize: 13, color: "var(--ink2)", textTransform: "capitalize" }}>{monthLabel}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setMonthOffset(m => m - 1)}
            style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", color: "var(--ink2)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", minWidth: 120, textAlign: "center", textTransform: "capitalize" }}>{monthLabel}</span>
          <button onClick={() => setMonthOffset(m => Math.min(0, m + 1))} disabled={isCurrentMonth}
            style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", color: isCurrentMonth ? "var(--ink3)" : "var(--ink2)", fontSize: 14, cursor: isCurrentMonth ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: isCurrentMonth ? 0.4 : 1 }}>›</button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "var(--ink3)", fontSize: 13, textAlign: "center", padding: 40 }}>Chargement...</div>
      ) : total === 0 && checkins.length === 0 ? (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600, marginBottom: 6 }}>Aucune donnée pour {monthLabel}</div>
          <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Fais ton check-in et log tes trades pour générer ton rapport mensuel.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <a href="/dashboard/checkin" style={{ background: "var(--navy)", color: "#fff", padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Faire le check-in →</a>
            <a href="/dashboard/trades" style={{ background: "var(--bg2)", color: "var(--ink)", padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid var(--border)" }}>Logger un trade →</a>
          </div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "P&L Net", value: `${pnlNet >= 0 ? "+" : ""}${pnlNet.toFixed(0)}${currency === "USD" ? "$" : currency === "GBP" ? "£" : "€"}`, color: pnlNet > 0 ? "var(--g)" : pnlNet < 0 ? "var(--r)" : "var(--ink3)", sub: accountSize ? `${pnlNet >= 0 ? "+" : ""}${((pnlNet / accountSize) * 100).toFixed(2)}%` : `${wins}W / ${losses}L` },
              { label: "Win Rate", value: winRate !== null ? `${winRate}%` : "—", color: winRate !== null ? (winRate >= 55 ? "var(--g)" : winRate >= 45 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: `${total} trades` },
              { label: "Profit Factor", value: profitFactor ?? "—", color: pfNum !== null ? (pfNum >= 1.5 ? "var(--g)" : pfNum >= 1 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: "gains / pertes" },
              { label: "Discipline", value: rulesOk !== null ? `${rulesOk}%` : "—", color: rulesOk !== null ? (rulesOk >= 80 ? "var(--g)" : rulesOk >= 60 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: "règles ok" },
              { label: "Score mental", value: avgScore ?? "—", color: avgScore ? (avgScore >= 75 ? "var(--g)" : avgScore >= 60 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: `${checkins.length} check-ins` },
            ].map((k, i) => (
              <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 700, color: k.color as string, lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Graphique semaines */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 16 }}>P&L par semaine</div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 100 }}>
              {weeks.map((w, i) => {
                const barH = w.pnl !== 0 ? Math.max(8, (Math.abs(w.pnl) / maxAbsPnl) * 88) : 3;
                const isPos = w.pnl >= 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: w.pnl !== 0 ? (isPos ? "var(--g)" : "var(--r)") : "transparent", fontWeight: 700, minHeight: 14, lineHeight: 1 }}>
                      {w.pnl !== 0 ? `${isPos ? "+" : ""}${w.pnl.toFixed(0)}` : ""}
                    </span>
                    <div style={{ width: "100%", height: barH, background: w.pnl === 0 ? "var(--bg3)" : isPos ? "rgba(22,101,52,.7)" : "rgba(155,28,28,.7)", borderRadius: 4 }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 500 }}>{w.label}</span>
                      {w.score !== null && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: w.score >= 75 ? "var(--g)" : w.score >= 60 ? "var(--a)" : "var(--r)" }} title={`Score moyen: ${w.score}`} />
                      )}
                      {w.trades > 0 && <span style={{ fontSize: 10, color: "var(--ink3)" }}>{w.trades}t</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink3)", marginTop: 10 }}>• Point coloré = score mental moyen de la semaine · t = nombre de trades</div>
          </div>

          {/* Corrélation score/P&L */}
          {(avgPnlHigh !== null || avgPnlMid !== null || avgPnlLow !== null) && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Score mental → Performance</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16 }}>P&L moyen selon ton état mental ce mois</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "État optimal", sublabel: "Score ≥ 75", val: avgPnlHigh, color: "var(--g)", count: highDays.length },
                  { label: "Attention requise", sublabel: "Score 60–74", val: avgPnlMid, color: "var(--a)", count: midDays.length },
                  { label: "Évite de trader", sublabel: "Score < 60", val: avgPnlLow, color: "var(--r)", count: lowDays.length },
                ].map((row, i) => row.val === null ? null : (() => {
                  const maxAbs = Math.max(...[avgPnlHigh, avgPnlMid, avgPnlLow].filter(v => v !== null).map(v => Math.abs(v!)), 1);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 140, flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: row.color }}>{row.label}</div>
                        <div style={{ fontSize: 11, color: "var(--ink3)" }}>{row.sublabel} · {row.count}j</div>
                      </div>
                      <div style={{ flex: 1, height: 28, background: "var(--bg2)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, bottom: 0, width: `${Math.max(4, (Math.abs(row.val) / maxAbs) * 100)}%`, left: row.val >= 0 ? 0 : "auto", right: row.val < 0 ? 0 : "auto", background: row.val >= 0 ? `${row.color}22` : "rgba(155,28,28,.15)", borderRadius: 6, border: `1px solid ${row.val >= 0 ? row.color : "var(--r)"}33` }} />
                        <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 12, fontWeight: 700, color: row.val >= 0 ? row.color : "var(--r)", whiteSpace: "nowrap" }}>
                          {row.val >= 0 ? "+" : ""}{row.val.toFixed(0)}€ / jour
                        </span>
                      </div>
                    </div>
                  );
                })())}
              </div>
            </div>
          )}

          {/* Emotions + Best/Worst */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {/* Emotions */}
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Émotions du mois</div>
              {topEmotions.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--ink3)" }}>Aucune émotion loggée.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {topEmotions.map(([emotion, stats], i) => {
                    const isToxic = emotion === "FOMO" || emotion === "Revenge";
                    const pct = Math.round((stats.count / total) * 100);
                    return (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: isToxic ? "var(--r)" : "var(--ink2)" }}>{emotion}</span>
                          <span style={{ fontSize: 11, color: "var(--ink3)" }}>{stats.count} trade{stats.count > 1 ? "s" : ""} · {pct}% · <span style={{ color: stats.pnl >= 0 ? "var(--g)" : "var(--r)", fontWeight: 700 }}>{stats.pnl >= 0 ? "+" : ""}{stats.pnl.toFixed(0)}€</span></span>
                        </div>
                        <div style={{ height: 4, background: "var(--bg3)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: isToxic ? "var(--r)" : "var(--navy)", borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Best / Worst */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bestTrade && bestTrade.pnl > 0 && (
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--g)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Meilleur trade</div>
                  <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, color: "var(--g)", fontWeight: 700 }}>+{bestTrade.pnl.toFixed(0)}€</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>{bestTrade.pair} · {bestTrade.direction} · {new Date(bestTrade.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
                </div>
              )}
              {worstTrade && worstTrade.pnl < 0 && (
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--r)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Pire trade</div>
                  <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, color: "var(--r)", fontWeight: 700 }}>{worstTrade.pnl.toFixed(0)}€</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>{worstTrade.pair} · {worstTrade.direction} · {new Date(worstTrade.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Analyse du mois</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {insights.map((ins, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: ins.type === "good" ? "var(--tint-g-bg)" : ins.type === "warn" ? "var(--tint-a-bg)" : "var(--tint-n-bg)", border: `1px solid ${ins.type === "good" ? "var(--tint-g-border)" : ins.type === "warn" ? "var(--tint-a-border)" : "var(--tint-n-border)"}` }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{ins.type === "good" ? "✓" : ins.type === "warn" ? "⚠" : "→"}</span>
                    <span style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.5 }}>{ins.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
