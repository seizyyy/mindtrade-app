"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Checkin = { score: number; date: string };
type Trade = { pnl: number; pair: string; emotion: string; date: string; respected_rules: boolean };

const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function UpgradeWall({ plan, userId, email }: { plan: string; userId: string; email: string }) {
  const isAnnual = plan === "annual";
  const upgradePrice = isAnnual ? 447 : 497;
  const savings = 597 - upgradePrice;
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "lifetime", email, userId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14 }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid rgba(184,134,11,.4)",
        borderRadius: 16,
        padding: "36px 40px",
        textAlign: "center",
        maxWidth: 420,
        boxShadow: "0 24px 64px rgba(0,0,0,.5)",
      }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>⭐</div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#b8860b", background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.35)", padding: "3px 12px", borderRadius: 20, letterSpacing: ".08em", textTransform: "uppercase", display: "inline-block", marginBottom: 16 }}>Accès Alpha</div>
        <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 10px" }}>
          Débloque ton intelligence comportementale
        </h3>
        <p style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.7, marginBottom: 24 }}>
          Corrélations état mental / P&L, tes patterns par jour, tes émotions en chiffres — tout ce que tes données révèlent sur toi.
        </p>

        <div style={{ background: "rgba(184,134,11,.07)", border: "1px solid rgba(184,134,11,.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>
            Offre abonné {isAnnual ? "annuel" : "mensuel"}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: "var(--ink3)", textDecoration: "line-through" }}>597€</span>
            <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 32, fontWeight: 700, color: "#fbbf24" }}>{upgradePrice}€</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--g)", fontWeight: 600 }}>Tu économises {savings}€ · Accès à vie</div>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #f59e0b, #b8860b)",
            color: "#fff",
            borderRadius: 8,
            padding: "13px",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-outfit)",
            boxShadow: "0 4px 20px rgba(184,134,11,.35)",
            marginBottom: 12,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Redirection…" : `Passer à Lifetime — ${upgradePrice}€ →`}
        </button>
        <div style={{ fontSize: 11, color: "var(--ink3)" }}>Paiement unique · Accès immédiat · Garanti à vie</div>
      </div>
    </div>
  );
}

export default function AlphaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>("monthly");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);
      setUserEmail(user.email ?? "");
      const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
      const plan = profile?.plan ?? "monthly";
      setUserPlan(plan);

      if (plan === "lifetime") {
        const [{ data: ci }, { data: tr }] = await Promise.all([
          supabase.from("checkins").select("score,date").eq("user_id", user.id).order("date", { ascending: false }).limit(90),
          supabase.from("trades").select("pnl,pair,emotion,date,respected_rules").eq("user_id", user.id).order("date", { ascending: false }).limit(200),
        ]);
        setCheckins(ci || []);
        setTrades(tr || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 14, padding: 40 }}>Chargement…</div>;

  const isLifetime = userPlan === "lifetime";

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

  // Fake blurred preview data for non-lifetime users
  const fakeContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }}>
      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Corrélation état mental → performance</div>
        <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Ce que ton score mental prédit réellement sur tes trades.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[{ c: "var(--r)", l: "État dégradé", v: "-347€", wr: "28% win" }, { c: "var(--a)", l: "Attention", v: "+82€", wr: "54% win" }, { c: "var(--g)", l: "État optimal", v: "+612€", wr: "79% win" }].map(b => (
            <div key={b.l} style={{ background: "var(--bg2)", borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid ${b.c}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: b.c, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>{b.l}</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: b.c, lineHeight: 1, marginBottom: 4 }}>{b.v}</div>
              <div style={{ fontSize: 12, color: "var(--ink3)" }}>moy. par trade · {b.wr}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Performance par jour de semaine</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map((d, i) => (
            <div key={d} style={{ textAlign: "center", background: "var(--bg2)", borderRadius: 10, padding: "14px 8px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", marginBottom: 8 }}>{d}</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, fontWeight: 700, color: i % 3 === 2 ? "var(--r)" : "var(--g)", marginBottom: 4 }}>{i % 3 === 2 ? "-284€" : "+539€"}</div>
              <div style={{ fontSize: 10, color: "var(--ink3)" }}>{i % 3 === 2 ? "33% win" : "75% win"}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Tes émotions en chiffres</div>
          {["Confiant", "Calme", "Stressé", "Revanche"].map((e, i) => (
            <div key={e} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: "var(--ink2)", width: 90 }}>{e}</div>
              <div style={{ flex: 1, height: 5, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${[82, 64, 38, 20][i]}%`, background: i < 2 ? "var(--g)" : "var(--r)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: i < 2 ? "var(--g)" : "var(--r)", width: 70, textAlign: "right" }}>{["+748€", "+183€", "-291€", "-512€"][i]}</div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Évolution du score mental</div>
          {[{ l: "30 derniers jours", v: "74/100" }, { l: "60 derniers jours", v: "68/100" }, { l: "90 derniers jours", v: "71/100" }].map(({ l, v }) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--ink3)" }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--g)" }}>{v}</span>
              </div>
              <div style={{ height: 5, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "74%", background: "var(--g)", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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

      {/* Non-lifetime : contenu flouté + upgrade wall */}
      {!isLifetime && (
        <div style={{ position: "relative" }}>
          {fakeContent}
          <UpgradeWall plan={userPlan} userId={userId} email={userEmail} />
        </div>
      )}

      {/* Lifetime : contenu réel */}
      {isLifetime && (!hasTrades || !hasCheckins) && (
        <div style={{ ...card, textAlign: "center", padding: "40px 24px", color: "var(--ink3)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>Pas encore assez de données</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>Fais au moins 5 check-ins et 3 trades pour débloquer ton analyse comportementale.</div>
        </div>
      )}

      {isLifetime && hasTrades && hasCheckins && (
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
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
          {todayCheckin && dayAvg !== null && dayPnls.length >= 3 && todayDow >= 1 && todayDow <= 5 && (
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
