"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Checkin = { score: number; date: string };
type Trade = { pnl: number; pair: string; emotion: string; date: string; respected_rules: boolean };

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function AlphaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const [{ data: ci }, { data: tr }] = await Promise.all([
        supabase.from("checkins").select("score,date").eq("user_id", user.id).order("date", { ascending: false }).limit(90),
        supabase.from("trades").select("pnl,pair,emotion,date,respected_rules").eq("user_id", user.id).order("date", { ascending: false }).limit(200),
      ]);
      setCheckins(ci || []);
      setTrades(tr || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 14, padding: 40 }}>Chargement…</div>;

  const hasTrades = trades.length >= 3;
  const hasCheckins = checkins.length >= 5;

  // ── 1. Corrélation score mental / P&L ───────────────────────────────────────
  const scoreMap: Record<string, number> = {};
  checkins.forEach(c => { scoreMap[c.date] = c.score; });

  const buckets = {
    low:  { label: "Score < 60", range: "État dégradé",  trades: [] as number[], color: "var(--r)" },
    mid:  { label: "Score 60–74", range: "Attention",    trades: [] as number[], color: "var(--a)" },
    high: { label: "Score ≥ 75", range: "État optimal",  trades: [] as number[], color: "var(--g)" },
  };
  trades.forEach(t => {
    const s = scoreMap[t.date];
    if (!s) return;
    if (s < 60) buckets.low.trades.push(t.pnl);
    else if (s < 75) buckets.mid.trades.push(t.pnl);
    else buckets.high.trades.push(t.pnl);
  });
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const winRate = (arr: number[]) => arr.length ? Math.round((arr.filter(x => x > 0).length / arr.length) * 100) : null;

  // ── 2. Performance par jour de semaine ──────────────────────────────────────
  const byDay: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  trades.forEach(t => {
    const d = new Date(t.date + "T12:00:00").getDay();
    byDay[d].push(t.pnl);
  });

  // ── 3. Meilleure et pire émotion ────────────────────────────────────────────
  const byEmotion: Record<string, number[]> = {};
  trades.forEach(t => {
    if (!byEmotion[t.emotion]) byEmotion[t.emotion] = [];
    byEmotion[t.emotion].push(t.pnl);
  });
  const emotionStats = Object.entries(byEmotion)
    .filter(([, arr]) => arr.length >= 2)
    .map(([emotion, arr]) => ({
      emotion,
      avg: avg(arr)!,
      winRate: winRate(arr)!,
      count: arr.length,
    }))
    .sort((a, b) => b.avg - a.avg);

  // ── 4. Score moyen 30 / 60 / 90 jours ──────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  const d30 = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const d60 = new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0];
  const d90 = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
  const avgScore = (from: string) => {
    const arr = checkins.filter(c => c.date >= from).map(c => c.score);
    return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
  };
  const s30 = avgScore(d30);
  const s60 = avgScore(d60);
  const s90 = avgScore(d90);
  const trend = s30 && s60 ? s30 - s60 : null;

  // ── 5. Alerte prédictive ────────────────────────────────────────────────────
  const todayCheckin = checkins.find(c => c.date === today);
  const recentLosses = trades.slice(0, 5).filter(t => t.pnl < 0).length;
  const todayDow = new Date().getDay();
  const dayPnls = byDay[todayDow];
  const dayAvg = avg(dayPnls);
  const dayWr = winRate(dayPnls);

  const card: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px",
  };

  return (
    <div style={{ maxWidth: 860 }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0 }}>Intelligence Alpha</h1>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#b8860b", background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.35)", padding: "3px 10px", borderRadius: 20, letterSpacing: ".06em", textTransform: "uppercase" }}>Lifetime</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink3)", margin: 0 }}>Patterns comportementaux détectés sur tes données réelles.</p>
        </div>
      </div>

      {(!hasTrades || !hasCheckins) && (
        <div style={{ ...card, textAlign: "center", padding: "40px 24px", color: "var(--ink3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>Pas encore assez de données</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>Fais au moins 5 check-ins et 3 trades pour débloquer ton analyse comportementale.</div>
        </div>
      )}

      {hasTrades && hasCheckins && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ── Corrélation Score / P&L ── */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Corrélation état mental → performance</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20, lineHeight: 1.5 }}>
              Ce que ton score mental prédit réellement sur tes trades.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {Object.values(buckets).map((b) => {
                const a = avg(b.trades);
                const wr = winRate(b.trades);
                return (
                  <div key={b.label} style={{ background: "var(--bg2)", borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid ${b.color}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: b.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{b.range}</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 12 }}>{b.label} · {b.trades.length} trade{b.trades.length !== 1 ? "s" : ""}</div>
                    {a !== null ? (
                      <>
                        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: a >= 0 ? "var(--g)" : "var(--r)", lineHeight: 1, marginBottom: 4 }}>
                          {a >= 0 ? "+" : ""}{a.toFixed(0)}€
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink3)" }}>moy. par trade · {wr}% win</div>
                      </>
                    ) : (
                      <div style={{ fontSize: 13, color: "var(--ink3)" }}>—</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Performance par jour ── */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Performance par jour de semaine</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Tes meilleurs et pires jours selon tes données réelles.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {[1, 2, 3, 4, 5].map(d => {
                const arr = byDay[d];
                const a = avg(arr);
                const wr = winRate(arr);
                const isGood = a !== null && a > 0;
                const isBad = a !== null && a < 0;
                return (
                  <div key={d} style={{ textAlign: "center", background: "var(--bg2)", borderRadius: 10, padding: "14px 8px", border: `1.5px solid ${isGood ? "rgba(34,197,94,.2)" : isBad ? "rgba(239,68,68,.2)" : "var(--border)"}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", marginBottom: 8 }}>{DAY_LABELS[d]}</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, fontWeight: 700, color: isGood ? "var(--g)" : isBad ? "var(--r)" : "var(--ink3)", marginBottom: 4 }}>
                      {a !== null ? `${a >= 0 ? "+" : ""}${a.toFixed(0)}€` : "—"}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--ink3)" }}>{wr !== null ? `${wr}% win` : `${arr.length} trades`}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Émotion / Performance + Score Evolution ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Émotion */}
            <div style={card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Tes émotions en chiffres</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Impact réel de chaque état sur tes résultats.</div>
              {emotionStats.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--ink3)" }}>Pas assez de données.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {emotionStats.map(e => (
                    <div key={e.emotion} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 13, color: "var(--ink2)", width: 100, flexShrink: 0 }}>{e.emotion}</div>
                      <div style={{ flex: 1, height: 5, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(100, Math.abs(e.winRate))}%`, background: e.avg >= 0 ? "var(--g)" : "var(--r)", borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: e.avg >= 0 ? "var(--g)" : "var(--r)", width: 70, textAlign: "right" }}>
                        {e.avg >= 0 ? "+" : ""}{e.avg.toFixed(0)}€ moy.
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink3)", width: 45, textAlign: "right" }}>{e.winRate}% W</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Score évolution */}
            <div style={card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Évolution du score mental</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Ta progression psychologique dans le temps.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[{ label: "30 derniers jours", val: s30 }, { label: "60 derniers jours", val: s60 }, { label: "90 derniers jours", val: s90 }].map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--ink3)" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: val ? val >= 75 ? "var(--g)" : val >= 60 ? "var(--a)" : "var(--r)" : "var(--ink3)" }}>
                        {val ? `${val}/100` : "—"}
                      </span>
                    </div>
                    {val && (
                      <div style={{ height: 5, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${val}%`, background: val >= 75 ? "var(--g)" : val >= 60 ? "var(--a)" : "var(--r)", borderRadius: 3, transition: "width .4s" }} />
                      </div>
                    )}
                  </div>
                ))}
                {trend !== null && (
                  <div style={{ marginTop: 4, fontSize: 12, color: trend > 0 ? "var(--g)" : trend < 0 ? "var(--r)" : "var(--ink3)", fontWeight: 600 }}>
                    {trend > 0 ? `↑ +${trend} pts` : trend < 0 ? `↓ ${trend} pts` : "→ Stable"} vs mois précédent
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Alerte prédictive ── */}
          {todayCheckin && dayAvg !== null && dayPnls.length >= 3 && (
            <div style={{ ...card, background: dayAvg < 0 ? "var(--tint-r-bg)" : "var(--tint-g-bg)", border: `1.5px solid ${dayAvg < 0 ? "var(--tint-r-border)" : "var(--tint-g-border)"}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: dayAvg < 0 ? "var(--r)" : "var(--g)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>⚡ Signal prédictif — {DAY_LABELS[todayDow]}</div>
              <div style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7 }}>
                Historiquement le <strong style={{ color: "var(--ink)" }}>{DAY_LABELS[todayDow]}</strong>, tu réalises en moyenne{" "}
                <strong style={{ color: dayAvg >= 0 ? "var(--g)" : "var(--r)" }}>{dayAvg >= 0 ? "+" : ""}{dayAvg.toFixed(0)}€</strong> avec un win rate de{" "}
                <strong style={{ color: "var(--ink)" }}>{dayWr}%</strong> ({dayPnls.length} trades analysés).
                {recentLosses >= 2 && <span style={{ color: "var(--r)" }}> ⚠ {recentLosses} pertes dans tes 5 derniers trades — risque de revenge trading élevé.</span>}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
