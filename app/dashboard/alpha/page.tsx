"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { sym } from "@/lib/currency";

type Checkin = { score: number; date: string };
type Trade = { pnl: number; pair: string; direction: string; emotion: string; date: string; respected_rules: boolean; mental_score: number | null };

const DAY_LABELS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function UpgradeWall({ plan, userId, email }: { plan: string; userId: string; email: string }) {
  const isAnnual = plan === "annual";
  const upgradePrice = isAnnual ? 197 : 497;
  const savings = 597 - upgradePrice;
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: `upgrade_${plan}`, email, userId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur : " + (data.error || "inconnue"));
        setLoading(false);
      }
    } catch (e) {
      alert("Erreur réseau. Réessaie.");
      setLoading(false);
    }
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
          Passe à Lifetime — MindTrade à vie
        </h3>
        <p style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.7, marginBottom: 24 }}>
          Un seul paiement, accès à vie à MindTrade + Alpha en exclusivité : corrélations état mental / P&L, patterns par jour, émotions en chiffres — tout ce que tes données révèlent sur toi.
        </p>

        <div style={{ background: "rgba(184,134,11,.07)", border: "1px solid rgba(184,134,11,.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>
            Offre abonné {isAnnual ? "annuel" : "mensuel"}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: "var(--ink3)", textDecoration: "line-through" }}>597€</span>
            <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 32, fontWeight: 700, color: "#fbbf24" }}>{upgradePrice}€</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--g)", fontWeight: 600 }}>{isAnnual ? "290€ + 197€ = 387€ au total · 100€ de rabais vs Lifetime" : `Tu économises ${savings}€ · Accès à vie`}</div>
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
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);
      setUserEmail(user.email ?? "");
      const { data: profile } = await supabase.from("profiles").select("plan,currency").eq("id", user.id).single();
      const plan = profile?.plan ?? "monthly";
      if (profile?.currency) setCurrency(profile.currency);
      setUserPlan(plan);

      if (plan === "lifetime") {
        const [{ data: ci }, { data: tr }] = await Promise.all([
          supabase.from("checkins").select("score,date").eq("user_id", user.id).order("date", { ascending: false }).limit(90),
          supabase.from("trades").select("pnl,pair,direction,emotion,date,respected_rules,mental_score").eq("user_id", user.id).order("date", { ascending: false }).limit(200),
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

  // ── 5. Signal prédictif ──────────────────────────────────────────────────────
  const todayCheckin = checkins.find(c => c.date === today);
  const recentLosses = trades.slice(0, 5).filter(t => t.pnl < 0).length;
  const todayDow = new Date().getDay();
  const dayPnls = byDay[todayDow];
  const dayAvg = avg(dayPnls);
  const dayWr = winRate(dayPnls);

  // ── 6. Paires ────────────────────────────────────────────────────────────────
  const byPair: Record<string, number[]> = {};
  trades.forEach(t => {
    const p = (t.pair || "").trim().toUpperCase();
    if (!p) return;
    if (!byPair[p]) byPair[p] = [];
    byPair[p].push(t.pnl);
  });
  const pairStats = Object.entries(byPair)
    .filter(([, arr]) => arr.length >= 2)
    .map(([pair, arr]) => ({ pair, avg: avg(arr)!, count: arr.length, wr: winRate(arr)! }))
    .sort((a, b) => b.avg - a.avg);

  // ── 7. Discipline ─────────────────────────────────────────────────────────────
  const disciplinedPnls   = trades.filter(t => t.respected_rules).map(t => t.pnl);
  const undisciplinedPnls = trades.filter(t => !t.respected_rules).map(t => t.pnl);
  const disciplineRate    = trades.length ? Math.round((disciplinedPnls.length / trades.length) * 100) : null;
  const disciplineAvg     = avg(disciplinedPnls);
  const undisciplineAvg   = avg(undisciplinedPnls);

  // ── 8. Insights auto-générés ──────────────────────────────────────────────────
  const weekdayPerf = [1,2,3,4,5]
    .map(d => ({ day: d, a: avg(byDay[d]), count: byDay[d].length, wr: winRate(byDay[d]) }))
    .filter(d => d.count >= 2 && d.a !== null)
    .sort((a, b) => b.a! - a.a!);
  const bestDay   = weekdayPerf[0] ?? null;
  const worstDay  = weekdayPerf[weekdayPerf.length - 1] ?? null;
  const bestEmo   = emotionStats[0] ?? null;
  const worstEmo  = emotionStats[emotionStats.length - 1] ?? null;
  const globalWr  = winRate(trades.map(t => t.pnl));
  const globalAvg = avg(trades.map(t => t.pnl));

  const insights: { type: "pos" | "neg" | "neu"; text: string }[] = [];
  if (bestDay && bestDay.a! > 0)
    insights.push({ type: "pos", text: `Le ${DAY_LABELS[bestDay.day]} est ton meilleur jour — ${bestDay.a! >= 0 ? "+" : ""}${bestDay.a!.toFixed(0)}${sym(currency)} moy. sur ${bestDay.count} trades (${bestDay.wr}% win).` });
  if (worstDay && worstDay.a! < 0)
    insights.push({ type: "neg", text: `Évite le ${DAY_LABELS[worstDay.day]} — tu perds en moyenne ${worstDay.a!.toFixed(0)}${sym(currency)} (${worstDay.wr}% win sur ${worstDay.count} trades).` });
  if (bestEmo && bestEmo.avg > 0)
    insights.push({ type: "pos", text: `État "${bestEmo.emotion}" = ton pic : +${bestEmo.avg.toFixed(0)}${sym(currency)}/trade, ${bestEmo.winRate}% win sur ${bestEmo.count} trades.` });
  if (worstEmo && worstEmo.avg < 0)
    insights.push({ type: "neg", text: `"${worstEmo.emotion}" te coûte ${worstEmo.avg.toFixed(0)}${sym(currency)} par trade (${worstEmo.winRate}% win) — identifie le déclencheur.` });
  if (disciplineAvg !== null && undisciplineAvg !== null && undisciplinedPnls.length >= 2) {
    const diff = disciplineAvg - undisciplineAvg;
    if (diff > 0) insights.push({ type: "pos", text: `Respecter tes règles te rapporte +${diff.toFixed(0)}${sym(currency)}/trade vs quand tu dévies.` });
    else if (diff < -20) insights.push({ type: "neu", text: `Tu performes mieux sans tes règles — réévalue-les, elles freinent peut-être ton edge.` });
  }
  if (pairStats.length > 0 && pairStats[0].avg > 0)
    insights.push({ type: "pos", text: `Meilleure paire : ${pairStats[0].pair} (+${pairStats[0].avg.toFixed(0)}${sym(currency)} moy., ${pairStats[0].wr}% win sur ${pairStats[0].count} trades).` });
  if (pairStats.length > 1 && pairStats[pairStats.length - 1].avg < 0)
    insights.push({ type: "neg", text: `Pire paire : ${pairStats[pairStats.length - 1].pair} (${pairStats[pairStats.length - 1].avg.toFixed(0)}${sym(currency)} moy.) — envisage de l'exclure.` });
  if (recentLosses >= 3)
    insights.push({ type: "neg", text: `${recentLosses} pertes dans tes 5 derniers trades — risque de revenge trading élevé.` });

  // ── Profil trader ─────────────────────────────────────────────────────────────
  const profileLines: string[] = [];
  if (globalWr !== null) profileLines.push(`Win rate global : ${globalWr}%${globalAvg !== null ? ` · Moyenne par trade : ${globalAvg >= 0 ? "+" : ""}${globalAvg.toFixed(0)}${sym(currency)}` : ""}.`);
  if (bestEmo) profileLines.push(`Tu performes le mieux en état "${bestEmo.emotion}"${bestDay ? ` et le ${DAY_LABELS[bestDay.day]}` : ""}.`);
  if (worstEmo && worstEmo.avg < 0) profileLines.push(`Ton point faible principal : trader en état "${worstEmo.emotion}".`);
  if (disciplineRate !== null) profileLines.push(`Tu respectes tes règles sur ${disciplineRate}% de tes trades${disciplineRate >= 75 ? " — bonne discipline" : disciplineRate >= 50 ? " — marge de progression" : " — discipline à travailler"}.`);

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
    <div>

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
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>Tes analyses arrivent bientôt</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>Tu as l'accès complet Alpha. Continue à logger tes trades et check-ins — dès 5 check-ins et 3 trades, tes analyses comportementales personnalisées se débloquent automatiquement.</div>
        </div>
      )}

      {isLifetime && hasTrades && hasCheckins && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* 1 ── Signal prédictif du jour ── */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Signal prédictif du jour</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>
              Basé sur ton historique, ce que ce jour de la semaine prédit sur ta performance.
            </div>
            {dayPnls.length < 3 || todayDow === 0 || todayDow === 6 ? (
              <div style={{ fontSize: 13, color: "var(--ink3)", padding: "14px 0" }}>
                {todayDow === 0 || todayDow === 6
                  ? "Nous sommes le week-end — les marchés sont fermés. Consulte ce signal en semaine."
                  : `Pas encore assez de trades un ${DAY_LABELS[todayDow]} (minimum 3 requis — ${dayPnls.length} pour l'instant).`}
              </div>
            ) : (
              <div style={{ background: dayAvg! < 0 ? "var(--tint-r-bg)" : dayAvg! >= 0 && dayWr! >= 60 ? "var(--tint-g-bg)" : "var(--tint-a-bg)", border: `1.5px solid ${dayAvg! < 0 ? "var(--tint-r-border)" : dayAvg! >= 0 && dayWr! >= 60 ? "var(--tint-g-border)" : "var(--tint-a-border)"}`, borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{dayAvg! < 0 ? "🔴" : dayWr! >= 60 ? "🟢" : "🟡"}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                    {dayAvg! < 0 ? "Journée historiquement défavorable" : dayWr! >= 60 ? "Journée historiquement favorable" : "Journée mitigée"}
                    {" — "}{DAY_LABELS[todayDow]}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.75 }}>
                  Sur <strong style={{ color: "var(--ink)" }}>{dayPnls.length} trades</strong> enregistrés un {DAY_LABELS[todayDow]}, tu réalises en moyenne{" "}
                  <strong style={{ color: dayAvg! >= 0 ? "var(--g)" : "var(--r)" }}>{dayAvg! >= 0 ? "+" : ""}{dayAvg!.toFixed(0)}{sym(currency)}</strong> avec un win rate de{" "}
                  <strong style={{ color: "var(--ink)" }}>{dayWr}%</strong>.
                  {dayAvg! < 0 && <span style={{ color: "var(--r)" }}> Réduis ta taille de position ou évite de trader aujourd'hui.</span>}
                  {dayAvg! >= 0 && dayWr! >= 60 && <span style={{ color: "var(--g)" }}> C'est l'un de tes meilleurs jours — trade avec confiance en respectant tes règles.</span>}
                  {dayAvg! >= 0 && dayWr! < 60 && <span style={{ color: "var(--a)" }}> Résultats variables — reste discipliné et ne sur-trade pas.</span>}
                </div>
                {recentLosses >= 2 && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(239,68,68,.08)", borderRadius: 7, fontSize: 12, color: "var(--r)", fontWeight: 600 }}>
                    ⚠ {recentLosses} pertes dans tes 5 derniers trades — risque de revenge trading élevé aujourd'hui.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2 ── Profil trader + Insights ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "linear-gradient(160deg, #0c1e38 0%, #152d4a 100%)", border: "1px solid rgba(212,168,50,.3)", borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: 15 }}>⭐</span>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".12em" }}>Ton profil de trader</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {globalWr !== null && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Win rate</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 700, color: globalWr >= 60 ? "var(--g)" : globalWr >= 45 ? "var(--a)" : "var(--r)" }}>{globalWr}%</div>
                  </div>
                )}
                {globalAvg !== null && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Moy. / trade</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 700, color: globalAvg >= 0 ? "var(--g)" : "var(--r)" }}>{globalAvg >= 0 ? "+" : ""}{globalAvg.toFixed(0)}{sym(currency)}</div>
                  </div>
                )}
                {bestEmo && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(34,197,94,.07)", border: "1px solid rgba(34,197,94,.18)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Meilleur état</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--g)" }}>{bestEmo.emotion}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}>+{bestEmo.avg.toFixed(0)}{sym(currency)} · {bestEmo.winRate}% win</div>
                  </div>
                )}
                {worstEmo && worstEmo.avg < 0 && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,.07)", border: "1px solid rgba(239,68,68,.18)" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Point faible</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--r)" }}>{worstEmo.emotion}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}>{worstEmo.avg.toFixed(0)}{sym(currency)} · {worstEmo.winRate}% win</div>
                  </div>
                )}
                {disciplineRate !== null && (
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>Discipline</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: disciplineRate >= 75 ? "var(--g)" : disciplineRate >= 50 ? "var(--a)" : "var(--r)" }}>{disciplineRate}%</div>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${disciplineRate}%`, background: disciplineRate >= 75 ? "var(--g)" : disciplineRate >= 50 ? "var(--a)" : "var(--r)", borderRadius: 3 }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {insights.length > 0 && (
              <div style={card}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>Insights personnalisés</div>
                <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14 }}>Détectés depuis tes données réelles.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {insights.map((ins, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 13px", borderRadius: 9, background: ins.type === "pos" ? "rgba(34,197,94,.05)" : ins.type === "neg" ? "rgba(239,68,68,.05)" : "var(--bg2)", border: `1px solid ${ins.type === "pos" ? "rgba(34,197,94,.18)" : ins.type === "neg" ? "rgba(239,68,68,.18)" : "var(--border)"}` }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: ins.type === "pos" ? "var(--g)" : ins.type === "neg" ? "var(--r)" : "var(--ink3)", flexShrink: 0, marginTop: 4 }} />
                      <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.6 }}>{ins.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3 ── Corrélation Score / P&L ── */}
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Corrélation état mental → performance</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20, lineHeight: 1.5 }}>Ce que ton score mental prédit réellement sur tes trades.</div>
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
                          {a >= 0 ? "+" : ""}{a.toFixed(0)}{sym(currency)}
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

          {/* 4 ── Impact discipline + Émotions ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {disciplineAvg !== null && undisciplineAvg !== null && undisciplinedPnls.length >= 2 && (
              <div style={card}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Impact discipline</div>
                <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>Ce que respecter tes règles change concrètement.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.18)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--g)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Règles respectées</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div style={{ fontSize: 12, color: "var(--ink3)" }}>{disciplinedPnls.length} trades<br />{disciplineRate}% du temps</div>
                      <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: disciplineAvg >= 0 ? "var(--g)" : "var(--r)" }}>{disciplineAvg >= 0 ? "+" : ""}{disciplineAvg.toFixed(0)}{sym(currency)}</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.18)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--r)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Règles non respectées</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div style={{ fontSize: 12, color: "var(--ink3)" }}>{undisciplinedPnls.length} trades<br />{100 - (disciplineRate ?? 0)}% du temps</div>
                      <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: undisciplineAvg >= 0 ? "var(--g)" : "var(--r)" }}>{undisciplineAvg >= 0 ? "+" : ""}{undisciplineAvg.toFixed(0)}{sym(currency)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: disciplineAvg > undisciplineAvg ? "var(--g)" : "var(--ink3)", textAlign: "center", paddingTop: 2 }}>
                    {disciplineAvg > undisciplineAvg ? `+${(disciplineAvg - undisciplineAvg).toFixed(0)}${sym(currency)}/trade en respectant tes règles` : "Écart faible — réévalue tes critères"}
                  </div>
                </div>
              </div>
            )}
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
                        {e.avg >= 0 ? "+" : ""}{e.avg.toFixed(0)}{sym(currency)} moy.
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink3)", width: 45, textAlign: "right" }}>{e.winRate}% W</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5 ── Performance par paire ── */}
          {pairStats.length > 0 && (
            <div style={card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Performance par paire</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20 }}>P&L moyen sur tes {pairStats.reduce((s, p) => s + p.count, 0)} trades loggés.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {(() => {
                  const maxAbs = Math.max(...pairStats.map(x => Math.abs(x.avg)));
                  return pairStats.slice(0, 8).map(p => {
                    const pct = maxAbs > 0 ? (Math.abs(p.avg) / maxAbs) * 100 : 0;
                    return (
                      <div key={p.pair} style={{ background: "var(--bg2)", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 700 }}>{p.pair}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: p.avg >= 0 ? "var(--g)" : "var(--r)" }}>{p.avg >= 0 ? "+" : ""}{p.avg.toFixed(0)}{sym(currency)}</span>
                        </div>
                        <div style={{ height: 4, background: "var(--bg3)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: p.avg >= 0 ? "var(--g)" : "var(--r)", borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: 11, color: "var(--ink3)" }}>{p.wr}% win · {p.count} trades</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* 6 ── Performance par jour + Évolution score ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
                        {a !== null ? `${a >= 0 ? "+" : ""}${a.toFixed(0)}${sym(currency)}` : "—"}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--ink3)" }}>{wr !== null ? `${wr}% win` : `${arr.length} trades`}</div>
                    </div>
                  );
                })}
              </div>
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

        </div>
      )}
    </div>
  );
}
