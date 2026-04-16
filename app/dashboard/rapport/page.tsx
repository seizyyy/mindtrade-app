"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Trade = { date: string; pnl: number; direction: string; respected_rules: boolean; mental_score: number | null; emotion: string; pair: string; };
type Checkin = { date: string; score: number; energie: number; focus: number; stress: number; confiance: number; };

function getWeekStart(offset = 0) {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmt(d: Date) { return d.toISOString().split("T")[0]; }

export default function RapportPage() {
  const router = useRouter();
  const supabase = createClient();

  const [weekOffset, setWeekOffset] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  useEffect(() => { load(); }, [weekOffset]);

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }

    const [{ data: t }, { data: c }] = await Promise.all([
      supabase.from("trades").select("*").eq("user_id", user.id).gte("date", fmt(weekStart)).lte("date", fmt(weekEnd)),
      supabase.from("checkins").select("*").eq("user_id", user.id).gte("date", fmt(weekStart)).lte("date", fmt(weekEnd)),
    ]);

    setTrades(t || []);
    setCheckins(c || []);
    setLoading(false);
  }

  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const total = trades.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : null;
  const pnlNet = trades.reduce((s, t) => s + t.pnl, 0);
  const rulesOk = total > 0 ? Math.round((trades.filter(t => t.respected_rules).length / total) * 100) : null;
  const avgScore = checkins.length > 0 ? Math.round(checkins.reduce((s, c) => s + c.score, 0) / checkins.length) : null;
  const bestDay = [...trades].sort((a, b) => b.pnl - a.pnl)[0] || null;
  const worstDay = [...trades].sort((a, b) => a.pnl - b.pnl)[0] || null;

  // Emotion breakdown
  const emotionMap: Record<string, number> = {};
  trades.forEach(t => { emotionMap[t.emotion] = (emotionMap[t.emotion] || 0) + 1; });
  const topEmotion = Object.entries(emotionMap).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Days of week
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const dayData = days.map((label, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = fmt(d);
    const dayTrades = trades.filter(t => t.date === dateStr);
    const dayCheckin = checkins.find(c => c.date === dateStr);
    const pnl = dayTrades.reduce((s, t) => s + t.pnl, 0);
    return { label, dateStr, trades: dayTrades.length, pnl, score: dayCheckin?.score ?? null, isToday: dateStr === fmt(new Date()) };
  });

  const maxAbsPnl = Math.max(...dayData.map(d => Math.abs(d.pnl)), 1);

  // Insight generation
  const insights: { type: "good" | "warn" | "info"; text: string }[] = [];
  if (winRate !== null && winRate >= 60) insights.push({ type: "good", text: `Win rate de ${winRate}% cette semaine — au-dessus de la moyenne.` });
  if (winRate !== null && winRate < 40) insights.push({ type: "warn", text: `Win rate de seulement ${winRate}% — analyse les entrées perdantes.` });
  if (rulesOk !== null && rulesOk < 70) insights.push({ type: "warn", text: `Règles respectées à ${rulesOk}% — la discipline reste le levier principal.` });
  if (rulesOk !== null && rulesOk === 100) insights.push({ type: "good", text: "100% des règles respectées — discipline parfaite cette semaine." });
  if (avgScore !== null && avgScore < 60) insights.push({ type: "warn", text: `Score mental moyen de ${avgScore}/100 — ton état impacte tes décisions.` });
  if (avgScore !== null && avgScore >= 75) insights.push({ type: "good", text: `Score mental moyen de ${avgScore}/100 — conditions optimales maintenues.` });
  if (topEmotion === "FOMO" || topEmotion === "Revenge") insights.push({ type: "warn", text: `Émotion dominante : ${topEmotion}. Attention aux trades impulsifs.` });
  if (checkins.length < 3 && total > 0) insights.push({ type: "info", text: "Moins de 3 check-ins cette semaine — le suivi mental est incomplet." });
  if (pnlNet > 0 && rulesOk !== null && rulesOk >= 80) insights.push({ type: "good", text: "Semaine profitable ET disciplinée — continue sur cette lancée." });

  const weekLabel = weekOffset === 0 ? "Cette semaine" : weekOffset === -1 ? "Semaine dernière" : `Semaine du ${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Rapport hebdomadaire</div>
          <div style={{ fontSize: 13, color: "var(--ink2)" }}>
            {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – {weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setWeekOffset(w => w - 1)}
            style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", color: "var(--ink2)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", minWidth: 120, textAlign: "center" }}>{weekLabel}</span>
          <button onClick={() => setWeekOffset(w => Math.min(0, w + 1))} disabled={weekOffset === 0}
            style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", color: weekOffset === 0 ? "var(--ink3)" : "var(--ink2)", fontSize: 14, cursor: weekOffset === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: weekOffset === 0 ? 0.4 : 1 }}>›</button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "var(--ink3)", fontSize: 13, textAlign: "center", padding: 40 }}>Chargement...</div>
      ) : total === 0 && checkins.length === 0 ? (
        <div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "32px 28px", textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600, marginBottom: 6 }}>Aucune donnée pour cette semaine</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Fais ton check-in et log tes trades pour voir ton rapport.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <a href="/dashboard/checkin" style={{ background: "var(--navy)", color: "#fff", padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Faire le check-in →</a>
              <a href="/dashboard/trades" style={{ background: "var(--bg2)", color: "var(--ink)", padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid var(--border)" }}>Logger un trade →</a>
            </div>
          </div>

          {/* Ce que le rapport va montrer */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Ce que tu vas débloquer</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { icon: "🔗", title: "Score mental → P&L", text: "Vois exactement combien tu gagnes (ou perds) de plus les jours où ton score est optimal." },
              { icon: "🧠", title: "Biais de la semaine", text: "FOMO, revenge, overconfiance — détectés automatiquement à partir de tes trades." },
              { icon: "📅", title: "Meilleur vs pire jour", text: "Identifie tes patterns de performance pour répliquer tes meilleures sessions." },
              { icon: "🎯", title: "Score de discipline", text: "% de règles respectées, check-ins effectués, émotions maîtrisées — tout en un chiffre." },
            ].map((f, i) => (
              <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px", display: "flex", gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.6 }}>{f.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Citation */}
          <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, color: "rgba(255,255,255,.9)", lineHeight: 1.6, fontStyle: "italic", marginBottom: 10 }}>
              "Ce n'est pas le marché qui te ruine. C'est ta réaction au marché."
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>— Mark Douglas, Trading in the Zone</div>
          </div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "P&L Net", value: `${pnlNet >= 0 ? "+" : ""}${pnlNet.toFixed(0)}€`, color: pnlNet > 0 ? "var(--g)" : pnlNet < 0 ? "var(--r)" : "var(--ink3)", sub: `${wins}W / ${losses}L` },
              { label: "Win Rate", value: winRate !== null ? `${winRate}%` : "—", color: winRate !== null ? (winRate >= 55 ? "var(--g)" : winRate >= 45 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: `${total} trade${total > 1 ? "s" : ""}` },
              { label: "Discipline", value: rulesOk !== null ? `${rulesOk}%` : "—", color: rulesOk !== null ? (rulesOk >= 80 ? "var(--g)" : rulesOk >= 60 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: "règles ok" },
              { label: "Score mental", value: avgScore ?? "—", color: avgScore ? (avgScore >= 75 ? "var(--g)" : avgScore >= 60 ? "var(--a)" : "var(--r)") : "var(--ink3)", sub: `${checkins.length} check-in${checkins.length > 1 ? "s" : ""}` },
            ].map((k, i) => (
              <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: k.color as string, lineHeight: 1 }}>{k.value}</div>
                {k.sub && <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>{k.sub}</div>}
              </div>
            ))}
          </div>

          {/* Corrélation score mental / P&L — insight clé MindTrade */}
          {checkins.length > 0 && total > 0 && (() => {
            const highDays = dayData.filter(d => d.score !== null && d.score >= 75);
            const lowDays  = dayData.filter(d => d.score !== null && d.score < 60);
            const midDays  = dayData.filter(d => d.score !== null && d.score >= 60 && d.score < 75);
            const avgPnlHigh = highDays.length ? highDays.reduce((s, d) => s + d.pnl, 0) / highDays.length : null;
            const avgPnlMid  = midDays.length  ? midDays.reduce((s, d) => s + d.pnl, 0)  / midDays.length  : null;
            const avgPnlLow  = lowDays.length  ? lowDays.reduce((s, d) => s + d.pnl, 0)  / lowDays.length  : null;
            const hasData = avgPnlHigh !== null || avgPnlMid !== null || avgPnlLow !== null;
            if (!hasData) return null;
            const maxAbs = Math.max(...[avgPnlHigh, avgPnlMid, avgPnlLow].filter(Boolean).map(v => Math.abs(v!)), 1);
            return (
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Score mental → Performance</div>
                <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16 }}>P&L moyen selon ton état mental</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "État optimal", sublabel: "Score ≥ 75", val: avgPnlHigh, color: "var(--g)", bg: "var(--tint-g-bg)", count: highDays.length },
                    { label: "Attention requise", sublabel: "Score 60–74", val: avgPnlMid, color: "var(--a)", bg: "var(--tint-a-bg)", count: midDays.length },
                    { label: "Évite de trader", sublabel: "Score < 60", val: avgPnlLow, color: "var(--r)", bg: "var(--tint-r-bg)", count: lowDays.length },
                  ].map((row, i) => row.val === null ? null : (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 130, flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: row.color }}>{row.label}</div>
                        <div style={{ fontSize: 11, color: "var(--ink3)" }}>{row.sublabel} · {row.count}j</div>
                      </div>
                      <div style={{ flex: 1, height: 28, background: "var(--bg2)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                        <div style={{
                          position: "absolute", top: 0, bottom: 0,
                          width: `${Math.max(4, (Math.abs(row.val) / maxAbs) * 100)}%`,
                          left: row.val >= 0 ? 0 : "auto",
                          right: row.val < 0 ? 0 : "auto",
                          background: row.val >= 0 ? row.bg : "var(--tint-r-bg)",
                          borderRadius: 6,
                          border: `1px solid ${row.val >= 0 ? row.color : "var(--r)"}20`,
                        }} />
                        <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 12, fontWeight: 700, color: row.val >= 0 ? row.color : "var(--r)", whiteSpace: "nowrap" }}>
                          {row.val >= 0 ? "+" : ""}{row.val.toFixed(0)}€ / jour
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Day chart */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 16 }}>P&L par jour</div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              {dayData.map((d, i) => {
                const barH = d.pnl !== 0 ? Math.max(8, (Math.abs(d.pnl) / maxAbsPnl) * 80) : 3;
                const isPos = d.pnl >= 0;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: d.pnl !== 0 ? (isPos ? "var(--g)" : "var(--r)") : "transparent", fontWeight: 700, minHeight: 14, lineHeight: 1 }}>
                      {d.pnl !== 0 ? `${isPos ? "+" : ""}${d.pnl.toFixed(0)}` : ""}
                    </span>
                    <div style={{ width: "100%", height: barH, background: d.pnl === 0 ? "var(--bg3)" : isPos ? "rgba(22,101,52,.7)" : "rgba(155,28,28,.7)", borderRadius: 4 }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 11, color: d.isToday ? "var(--navy)" : "var(--ink3)", fontWeight: d.isToday ? 700 : 500 }}>{d.label}</span>
                      {d.score && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.score >= 75 ? "var(--g)" : d.score >= 60 ? "var(--a)" : "var(--r)" }} title={`Score: ${d.score}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink3)", marginTop: 10 }}>• Point coloré = score mental du jour</div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Analyse de la semaine</div>
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

          {/* Best / Worst */}
          {(bestDay || worstDay) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {bestDay && (
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--g)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Meilleur trade</div>
                  <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--g)", fontWeight: 700 }}>+{bestDay.pnl.toFixed(0)}€</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>{bestDay.pair} · {bestDay.direction} · {new Date(bestDay.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
                </div>
              )}
              {worstDay && worstDay.pnl < 0 && (
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--r)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Pire trade</div>
                  <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--r)", fontWeight: 700 }}>{worstDay.pnl.toFixed(0)}€</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 4 }}>{worstDay.pair} · {worstDay.direction} · {new Date(worstDay.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
