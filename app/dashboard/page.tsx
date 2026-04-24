"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { sym } from "@/lib/currency";

type Checkin = { score: number; date: string };
type Trade = { pnl: number; direction: string; pair: string; emotion: string; date: string; respected_rules: boolean };

// ── Signal feu tricolore ─────────────────────────────────────────────────────
function getSignal(score: number | null, consecutiveLosses: number, hasToxicRecent: boolean) {
  if (!score) return null;
  if (score < 60 || consecutiveLosses >= 3)
    return {
      level: "STOP" as const,
      label: "État mental dégradé",
      color: "var(--r)", lightColor: "#f06060",
      bg: "var(--tint-r-bg)", border: "var(--tint-r-border)",
      desc: "Tes capacités de jugement sont altérées. Si tu trades, réduis drastiquement la taille et n'opère que sur tes setups les plus évidents. La meilleure décision est souvent de ne pas trader.",
    };
  if (score < 75 || consecutiveLosses >= 2 || hasToxicRecent)
    return {
      level: "CAUTION" as const,
      label: "Conditions non optimales",
      color: "var(--a)", lightColor: "#e0a020",
      bg: "var(--tint-a-bg)", border: "var(--tint-a-border)",
      desc: "Tu peux opérer, mais avec une taille réduite et des critères d'entrée stricts. Chaque trade doit remplir l'intégralité de tes conditions — pas de compromis aujourd'hui.",
    };
  return {
    level: "GO" as const,
    label: "État mental optimal",
    color: "var(--g)", lightColor: "#34c45a",
    bg: "var(--tint-g-bg)", border: "var(--tint-g-border)",
    desc: "Bonne condition pour opérer. Applique ton plan avec discipline — la sur-confiance est le risque principal dans cet état.",
  };
}

// ── Conseil de gestion du risque (sans chiffre imposé) ───────────────────────
function getRiskAdvice(level: "GO" | "CAUTION" | "STOP") {
  if (level === "STOP") return { label: "Réduis ton risque au minimum", color: "var(--r)", bg: "var(--tint-r-bg)", border: "var(--tint-r-border)" };
  if (level === "CAUTION") return { label: "Réduis ton risque", color: "var(--a)", bg: "var(--tint-a-bg)", border: "var(--tint-a-border)" };
  return null; // GO → pas de conseil supplémentaire nécessaire
}

// ── Facteur limitant (émotion qui coûte le plus) ─────────────────────────────
function getLimitingFactor(trades: Trade[]) {
  if (trades.length < 3) return null;
  const byEmotion: Record<string, { count: number; pnl: number; losses: number }> = {};
  trades.forEach(t => {
    if (!byEmotion[t.emotion]) byEmotion[t.emotion] = { count: 0, pnl: 0, losses: 0 };
    byEmotion[t.emotion].count++;
    byEmotion[t.emotion].pnl += t.pnl;
    if (t.pnl < 0) byEmotion[t.emotion].losses++;
  });
  const worst = Object.entries(byEmotion)
    .filter(([, s]) => s.pnl < 0 && s.count >= 2)
    .sort((a, b) => a[1].pnl - b[1].pnl)[0];
  if (!worst) return null;
  const [emotion, stats] = worst;
  return {
    emotion,
    loss: Math.abs(stats.pnl),
    lossRate: Math.round((stats.losses / stats.count) * 100),
    count: stats.count,
  };
}

// ── Objectif du jour basé sur le facteur limitant ────────────────────────────
function getObjectif(lf: ReturnType<typeof getLimitingFactor>, score: number | null) {
  if (!score) return "Fais ton check-in avant d'ouvrir tes charts.";
  if (!lf) {
    if (score >= 75) return "Conditions optimales. Reste dans ton plan, applique tes critères d'entrée habituels sans les assouplir ni les durcir.";
    return "Score modéré : réduis ta taille de position et n'entre qu'en setups qui remplissent tous tes critères — sans exception.";
  }
  const map: Record<string, string> = {
    "FOMO": "Avant chaque entrée, pose-toi une question : ce trade remplit-il mes critères, ou est-ce que je réagis au mouvement du marché ? La réponse doit être immédiate.",
    "Revenge": "Fixe une limite stricte de trades pour aujourd'hui. Après une perte, prends du recul — le marché sera là demain. La récupération forcée aggrave toujours la situation.",
    "Anxieux": "Réduis ta taille de position pour ramener le risque à un niveau qui ne génère pas de pression. Trader confortablement, c'est décider clairement.",
    "Euphorique": "La sur-confiance est aussi dangereuse que la peur. Applique tes critères avec la même rigueur qu'un mauvais jour — les marchés ne récompensent pas l'euphorie.",
    "Frustré": "La frustration altère le jugement. Si tu ressens de l'irritation pendant la session, éloigne-toi des charts avant de prendre une décision.",
    "Impatient": "L'impatience est la source de la majorité des entrées hors plan. Attends que le marché vienne à toi selon tes critères — pas l'inverse.",
    "Calme": "Excellent état de base. Reste attentif à ne pas relâcher ta discipline par excès de confort.",
    "Confiant": "La confiance est un atout — assure-toi qu'elle repose sur l'analyse, pas sur les derniers résultats.",
  };
  return map[lf.emotion] || `L'état "${lf.emotion}" affecte tes performances. Identifie ce qu'il génère concrètement dans tes décisions — c'est là que tu progresseras.`;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [todayCheckin, setTodayCheckin] = useState<Checkin | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [showUnlocked, setShowUnlocked] = useState(false);
  const [accountSize, setAccountSize] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [monthlyGoal, setMonthlyGoal] = useState<number | null>(null);
  const [maxDailyLossAmount, setMaxDailyLossAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("EUR");
  const [market, setMarket] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);
      const [{ data: ci }, { data: tr }, { data: cis }, { data: profile }] = await Promise.all([
        supabase.from("checkins").select("score,date").eq("user_id", user.id).eq("date", today).single(),
        supabase.from("trades").select("pnl,direction,pair,emotion,date,respected_rules")
          .eq("user_id", user.id).gte("date", monthAgo)
          .order("date", { ascending: false }).order("created_at", { ascending: false }).limit(60),
        supabase.from("checkins").select("score,date")
          .eq("user_id", user.id).order("date", { ascending: false }).limit(30),
        supabase.from("profiles").select("account_size,display_name,monthly_goal,max_daily_loss,currency,market").eq("id", user.id).single(),
      ]);
      setTodayCheckin(ci || null);
      setTrades(tr || []);
      setCheckins(cis || []);
      if (profile?.account_size) setAccountSize(profile.account_size);
      if (profile?.display_name) setDisplayName(profile.display_name);
      if (profile?.monthly_goal) setMonthlyGoal(profile.monthly_goal);
      if (profile?.max_daily_loss) setMaxDailyLossAmount(profile.max_daily_loss);
      if (profile?.currency) setCurrency(profile.currency);
      if (profile?.market) setMarket(profile.market);
      // Affiche la carte unlock une seule fois
      const alreadySeen = localStorage.getItem(`mt-unlocked-${user.id}`);
      if (!alreadySeen && (cis || []).length >= 3 && (tr || []).length >= 1) {
        setShowUnlocked(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  const [userId, setUserId] = useState<string>("");

  function dismissUnlocked() {
    if (userId) localStorage.setItem(`mt-unlocked-${userId}`, "1");
    setShowUnlocked(false);
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ fontSize: 13, color: "var(--ink3)" }}>Chargement...</div>
    </div>
  );

  // ── Métriques ─────────────────────────────────────────────────────────────

  const weekTrades = trades.filter(t => t.date >= weekAgo);
  const winTrades  = weekTrades.filter(t => t.pnl > 0);
  const lossTrades = weekTrades.filter(t => t.pnl < 0);
  const winRate = weekTrades.length > 0 ? Math.round((winTrades.length / weekTrades.length) * 100) : null;
  const pnlNet  = weekTrades.reduce((s, t) => s + t.pnl, 0);

  // Profit factor (30 jours)
  const allWinsSum  = trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
  const allLossSum  = Math.abs(trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
  const profitFactor: string | null =
    trades.length === 0 ? null :
    allLossSum === 0 ? "∞" :
    (allWinsSum / allLossSum).toFixed(2);
  const pfNum = profitFactor === null ? null : profitFactor === "∞" ? Infinity : parseFloat(profitFactor);
  const pfColor = pfNum === null ? "var(--ink3)" : pfNum >= 1.5 ? "var(--g)" : pfNum >= 1 ? "var(--a)" : "var(--r)";

  // Alerte perte journalière
  const todayTrades = trades.filter(t => t.date === today);
  const todayPnl = todayTrades.reduce((s, t) => s + t.pnl, 0);
  const dailyLossReached = maxDailyLossAmount !== null && todayPnl < 0 && Math.abs(todayPnl) >= maxDailyLossAmount;
  const dailyLossClose = maxDailyLossAmount !== null && todayPnl < 0 && Math.abs(todayPnl) >= maxDailyLossAmount * 0.75 && !dailyLossReached;

  // Objectif mensuel
  const monthTrades = trades.filter(t => t.date >= monthStart);
  const monthPnl = monthTrades.reduce((s, t) => s + t.pnl, 0);
  const monthPnlPct = accountSize && accountSize > 0 ? (monthPnl / accountSize) * 100 : null;
  const goalProgress = monthlyGoal && monthPnlPct !== null ? Math.min(100, Math.max(0, (monthPnlPct / monthlyGoal) * 100)) : null;

  // Pertes consécutives (du plus récent)
  let consecutiveLosses = 0;
  for (const t of trades) { if (t.pnl < 0) consecutiveLosses++; else break; }

  // Émotion toxique dans les 5 derniers trades
  const hasToxicRecent = trades.slice(0, 5).some(t => t.emotion === "FOMO" || t.emotion === "Revenge");

  // Score moyen 7j
  const avgScore = checkins.length > 0
    ? Math.round(checkins.slice(0, 7).reduce((s, c) => s + c.score, 0) / Math.min(checkins.length, 7))
    : null;

  // Streak
  let streak = 0;
  const dStr = new Date();
  for (const ci of checkins) {
    if (ci.date === dStr.toISOString().split("T")[0]) { streak++; dStr.setDate(dStr.getDate() - 1); }
    else break;
  }

  // Score de discipline (28j)
  const last28Str = new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0];
  const recentCIs = checkins.filter(c => c.date >= last28Str);
  const recentTR  = trades.filter(t => t.date >= last28Str);
  const dFactors: number[] = [Math.min(100, Math.round((recentCIs.length / 20) * 100))];
  if (recentTR.length > 0) {
    dFactors.push(Math.round((recentTR.filter(t => t.respected_rules).length / recentTR.length) * 100));
    const toxic = recentTR.filter(t => t.emotion === "FOMO" || t.emotion === "Revenge").length;
    dFactors.push(Math.round(((recentTR.length - toxic) / recentTR.length) * 100));
  }
  const disciplineScore = Math.round(dFactors.reduce((a, b) => a + b, 0) / dFactors.length);
  const dColor = disciplineScore >= 80 ? "var(--g)" : disciplineScore >= 60 ? "var(--a)" : "var(--r)";
  const dLabel = disciplineScore >= 80 ? "Excellent" : disciplineScore >= 60 ? "À améliorer" : "Attention";

  // Facteur limitant & objectif
  const lf = getLimitingFactor(trades);
  const objectif = getObjectif(lf, todayCheckin?.score ?? null);

  // Signal & conseil de risque
  const signal = getSignal(todayCheckin?.score ?? null, consecutiveLosses, hasToxicRecent);
  const riskAdvice = signal ? getRiskAdvice(signal.level) : null;

  // Verdict score mental
  const score = todayCheckin?.score ?? null;
  const verdictColor = !score ? "var(--ink3)" : score >= 75 ? "var(--g)" : score >= 60 ? "var(--a)" : "var(--r)";
  const verdictLabel = !score ? "Pas de check-in" : score >= 75 ? "État optimal" : score >= 60 ? "Attention requise" : "Évite de trader";

  const isOnboarding = checkins.length < 3;
  const isWeekend = [0, 6].includes(new Date().getDay()) && market !== "Crypto";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Onboarding — nouveau membre ── */}
      {checkins.length === 0 && trades.length === 0 && (
        <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,.08), rgba(59,130,246,.03))", border: "1px solid rgba(59,130,246,.2)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👋</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Bienvenue sur MindTrade !</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.6 }}>
                Commence par le <strong style={{ color: "var(--ink2)" }}>Guide</strong> — il t'explique comment renseigner ton track record et tirer le maximum de l'outil.
              </div>
            </div>
          </div>
          <a href="/dashboard/guide" style={{ flexShrink: 0, background: "var(--navy)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>
            Voir le Guide →
          </a>
        </div>
      )}

      {/* ── Alerte perte journalière — EN PREMIER ── */}
      {dailyLossReached && (
        <div style={{ background: "var(--tint-r-bg)", border: "2px solid var(--tint-r-border)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>⛔</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--r)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Limite journalière atteinte — Ferme le terminal</div>
            <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.65 }}>
              Tu as perdu <strong style={{ color: "var(--r)" }}>{Math.abs(todayPnl).toFixed(0)} {sym(currency)}</strong> aujourd'hui — ta limite est <strong style={{ color: "var(--ink)" }}>{maxDailyLossAmount!.toFixed(0)} {sym(currency)}</strong>. Revenir demain est toujours plus rentable que tenter de récupérer.
            </div>
          </div>
        </div>
      )}
      {dailyLossClose && (
        <div style={{ background: "var(--tint-a-bg)", border: "2px solid var(--tint-a-border)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--a)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Limite journalière proche</div>
            <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.65 }}>
              Tu as perdu <strong style={{ color: "var(--a)" }}>{Math.abs(todayPnl).toFixed(0)} {sym(currency)}</strong> sur ta limite de <strong style={{ color: "var(--ink)" }}>{maxDailyLossAmount!.toFixed(0)} {sym(currency)}</strong>. Il te reste <strong style={{ color: "var(--ink)" }}>{(maxDailyLossAmount! - Math.abs(todayPnl)).toFixed(0)} {sym(currency)}</strong> — trade uniquement tes meilleurs setups.
            </div>
          </div>
        </div>
      )}

      {/* ── Banner check-in manquant ── */}
      {!todayCheckin && !isWeekend && (
        <div style={{ background: "var(--tint-a-bg)", border: "1px solid var(--tint-a-border)", borderRadius: 10, padding: "11px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--a)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "var(--a)", flex: 1 }}>
            {displayName
              ? <><strong style={{ color: "var(--ink)", fontWeight: 800 }}>{displayName}</strong>, tu n'as pas fait ton check-in</>
              : <strong>Check-in non effectué</strong>
            } — Prends 2 minutes avant d{"'"}ouvrir tes charts.
          </div>
          <a href="/dashboard/checkin" style={{ fontSize: 12, fontWeight: 700, color: "var(--a)", background: "var(--tint-a-bg)", padding: "5px 14px", borderRadius: 6, textDecoration: "none", flexShrink: 0 }}>
            Faire maintenant →
          </a>
        </div>
      )}

      {/* ── Alerte pertes consécutives ── */}
      {consecutiveLosses >= 2 && (
        <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <div style={{ flex: 1, fontSize: 13, color: "var(--r)" }}>
            <strong>{consecutiveLosses} pertes consécutives</strong>
            <span style={{ color: "var(--ink2)", fontWeight: 400, marginLeft: 8 }}>— Le risque de revenge trading est élevé. Prends une pause avant le prochain trade.</span>
          </div>
        </div>
      )}

      {/* ── Signal du jour / Weekend ── */}
      {isWeekend ? (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 28px", display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 36, flexShrink: 0 }}>🌙</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>Week-end</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Marché fermé — pas de check-in</div>
            <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.65 }}>
              Profite du week-end pour revoir ta semaine et préparer celle qui arrive. Analyse tes trades, identifie tes patterns, et définis tes niveaux clés.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <a href="/dashboard/rapport" style={{ background: "var(--tint-n-bg)", border: "1px solid var(--border)", color: "var(--navy)", padding: "9px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
              Rapport hebdo →
            </a>
            <a href="/dashboard/rapport-mensuel" style={{ background: "var(--tint-n-bg)", border: "1px solid var(--border)", color: "var(--navy)", padding: "9px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
              Rapport mensuel →
            </a>
          </div>
        </div>
      ) : signal ? (
        <div style={{ background: signal.bg, border: `1.5px solid ${signal.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 24 }}>
          {/* Feux tricolores */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
            {(["GO", "CAUTION", "STOP"] as const).map(l => (
              <div key={l} style={{
                width: 14, height: 14, borderRadius: "50%",
                background: signal.level === l
                  ? (l === "GO" ? "#34c45a" : l === "CAUTION" ? "#e0a020" : "#f06060")
                  : "rgba(128,128,128,.15)",
                boxShadow: signal.level === l
                  ? `0 0 10px ${l === "GO" ? "rgba(52,196,90,.7)" : l === "CAUTION" ? "rgba(224,160,32,.7)" : "rgba(240,96,96,.7)"}`
                  : "none",
                transition: "all .3s",
              }} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: signal.color, textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 4 }}>Signal de session</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: signal.color, marginBottom: 6 }}>{signal.label}</div>
            <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.65, maxWidth: 500 }}>{signal.desc}</div>
          </div>
          {riskAdvice && (
            <div style={{ flexShrink: 0, textAlign: "center", background: riskAdvice.bg, border: `1px solid ${riskAdvice.border}`, borderRadius: 12, padding: "16px 20px", maxWidth: 160 }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{signal?.level === "STOP" ? "⚠️" : "↓"}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: riskAdvice.color, lineHeight: 1.35 }}>{riskAdvice.label}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)", borderRadius: 14, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 8 }}>Signal de session</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Non disponible</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
              Fais ton check-in pour recevoir ton signal de session du jour.
            </div>
          </div>
          <a href="/dashboard/checkin" style={{ flexShrink: 0, background: "#fff", color: "var(--navy)", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Faire le check-in →
          </a>
        </div>
      )}

      {/* ── 4 métriques rapides ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
        {/* Score mental */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Score mental</div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 38, fontWeight: 700, color: verdictColor, lineHeight: 1, marginBottom: 4 }}>
            {score ?? "—"}
          </div>
          <div style={{ fontSize: 11, color: verdictColor, fontWeight: 600 }}>{verdictLabel}</div>
          {streak > 0 && <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>🔥 {streak}j de streak</div>}
        </div>

        {/* Win rate */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Win rate</div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 38, fontWeight: 700, color: winRate !== null ? winRate >= 50 ? "var(--g)" : "var(--r)" : "var(--ink3)", lineHeight: 1, marginBottom: 4 }}>
            {winRate !== null ? `${winRate}%` : "—"}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink3)" }}>
            {weekTrades.length > 0 ? `${winTrades.length}W · ${lossTrades.length}L · 7 jours` : "Aucun trade cette semaine"}
          </div>
        </div>

        {/* P&L net */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>P&L net</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 38, fontWeight: 700, color: weekTrades.length > 0 ? pnlNet >= 0 ? "var(--g)" : "var(--r)" : "var(--ink3)", lineHeight: 1 }}>
              {weekTrades.length > 0 ? `${pnlNet >= 0 ? "+" : ""}${pnlNet.toFixed(0)}${sym(currency)}` : "—"}
            </div>
            {weekTrades.length > 0 && accountSize && (
              <div style={{ fontSize: 12, fontWeight: 700, color: pnlNet >= 0 ? "var(--g)" : "var(--r)", background: pnlNet >= 0 ? "rgba(22,101,52,.08)" : "rgba(155,28,28,.08)", border: `1px solid ${pnlNet >= 0 ? "rgba(22,101,52,.2)" : "rgba(155,28,28,.2)"}`, borderRadius: 6, padding: "3px 8px", lineHeight: 1.2 }}>
                {pnlNet >= 0 ? "+" : ""}{((pnlNet / accountSize) * 100).toFixed(2)}%
              </div>
            )}
            {weekTrades.length > 0 && !accountSize && winRate !== null && (
              <div style={{ fontSize: 11, fontWeight: 700, color: winRate >= 50 ? "var(--g)" : "var(--r)", background: winRate >= 50 ? "rgba(22,101,52,.08)" : "rgba(155,28,28,.08)", border: `1px solid ${winRate >= 50 ? "rgba(22,101,52,.2)" : "rgba(155,28,28,.2)"}`, borderRadius: 6, padding: "3px 8px", lineHeight: 1.2 }}>
                {winRate}% win
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink3)" }}>
            {accountSize
              ? `Cette semaine · ${winRate !== null ? winRate + "% win" : ""}`
              : <><span>Cette semaine · </span><a href="/dashboard/settings" style={{ color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>Ajouter ton capital →</a></>
            }
          </div>
          {goalProgress !== null && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em" }}>Objectif mensuel</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: goalProgress >= 100 ? "var(--g)" : "var(--ink2)" }}>
                  {monthPnlPct! >= 0 ? "+" : ""}{monthPnlPct!.toFixed(1)}% / {monthlyGoal}%
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "var(--bg3)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${goalProgress}%`, borderRadius: 2, background: goalProgress >= 100 ? "var(--g)" : monthPnlPct! < 0 ? "var(--r)" : "var(--navy)", transition: "width .4s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Profit factor */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Profit factor</div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 38, fontWeight: 700, color: pfColor, lineHeight: 1, marginBottom: 4 }}>
            {profitFactor ?? "—"}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink3)" }}>
            {pfNum !== null && pfNum < 1 ? "Pertes > gains" : pfNum !== null && pfNum >= 1.5 ? "Stratégie rentable" : pfNum !== null ? "À améliorer" : "30 derniers jours"}
          </div>
        </div>
      </div>

      {/* ── Graphique 7j + Facteur limitant & Objectif ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12 }}>

        {/* Graphique score 7j — élargi */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Score mental — 7 jours</div>
            {avgScore && (
              <div style={{ fontSize: 12, color: "var(--ink2)" }}>
                Moyenne : <strong style={{ color: avgScore >= 75 ? "var(--g)" : avgScore >= 60 ? "var(--a)" : "var(--r)" }}>{avgScore}/100</strong>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split("T")[0];
              const ci = checkins.find(c => c.date === dateStr);
              const h = ci ? Math.max(10, Math.round((ci.score / 100) * 108)) : 5;
              const barColor = ci ? ci.score >= 75 ? "#22c55e" : ci.score >= 60 ? "#f59e0b" : "#ef4444" : "var(--bg3)";
              const isToday = dateStr === today;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%" }}>
                  {ci && <div style={{ fontSize: 10, color: barColor, fontWeight: 700 }}>{ci.score}</div>}
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div
                      style={{ width: "100%", height: h, background: barColor, borderRadius: 5, transition: "height .4s", opacity: isToday ? 1 : 0.8, outline: isToday ? `2px solid ${barColor}` : "none", outlineOffset: 2 }}
                      title={ci ? `${dateStr} — Score : ${ci.score}` : "Pas de check-in"}
                    />
                  </div>
                  <div style={{ fontSize: 9, color: isToday ? "var(--ink)" : "var(--ink3)", fontWeight: isToday ? 700 : 500 }}>
                    {date.toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2).toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
          {checkins.length >= 2 && (() => {
            const diff = checkins[0].score - checkins[1].score;
            const trendColor = diff > 0 ? "var(--g)" : diff < 0 ? "var(--r)" : "var(--ink3)";
            return (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--ink3)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: trendColor, fontWeight: 700 }}>
                  {diff > 0 ? `↑ +${diff} pts` : diff < 0 ? `↓ ${diff} pts` : "→ Stable"}
                </span>
                <span>par rapport à hier</span>
                {Math.abs(diff) >= 15 && (
                  <span style={{ color: trendColor, fontSize: 10, fontWeight: 600, background: trendColor === "var(--g)" ? "var(--tint-g-bg)" : "var(--tint-r-bg)", borderRadius: 4, padding: "1px 6px" }}>
                    {diff > 0 ? "Bonne progression" : "Variation importante"}
                  </span>
                )}
              </div>
            );
          })()}
        </div>

        {/* Facteur limitant + Objectif du jour */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={lf
            ? { background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 12, padding: "16px 18px", flex: 1 }
            : { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", flex: 1 }
          }>
            <div style={{ fontSize: 10, fontWeight: 700, color: lf ? "var(--r)" : "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>
              Facteur limitant n°1
            </div>
            {lf ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
                  {lf.emotion} · {lf.lossRate}% de pertes
                </div>
                <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.65 }}>
                  Cet état t{"'"}a coûté{" "}
                  <strong style={{ color: "var(--r)" }}>−{lf.loss.toFixed(0)}{sym(currency)}</strong>{" "}
                  sur tes {lf.count} trades en mode {lf.emotion.toLowerCase()}.
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.6 }}>
                {trades.length < 3
                  ? "Enregistre au moins 3 trades pour détecter tes patterns émotionnels."
                  : "Aucun pattern négatif dominant détecté. Continue à logger tes trades."}
              </div>
            )}
          </div>

          <div style={{ background: "var(--tint-n-bg)", border: "1px solid var(--tint-n-border)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
              Objectif du jour
            </div>
            <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.7 }}>{objectif}</div>
          </div>
        </div>
      </div>

      {/* ── Derniers trades + Score de discipline ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* Derniers trades */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Derniers trades</div>
            <a href="/dashboard/trades" style={{ fontSize: 12, color: "var(--navy)", fontWeight: 600, textDecoration: "none" }}>Tout voir →</a>
          </div>
          {trades.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 10 }}>Aucun trade enregistré</div>
              <a href="/dashboard/trades" style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textDecoration: "none", background: "var(--tint-n-bg)", padding: "7px 16px", borderRadius: 7, display: "inline-block" }}>
                Logger un trade →
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {trades.slice(0, 6).map((t, i) => {
                const isToxic = t.emotion === "FOMO" || t.emotion === "Revenge";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < Math.min(5, trades.length - 1) ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.pnl >= 0 ? "var(--g)" : "var(--r)", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", flex: 1 }}>{t.pair}</span>
                    <span style={{
                      fontSize: 11, background: isToxic ? "var(--tint-r-bg)" : "var(--bg2)",
                      color: isToxic ? "var(--r)" : "var(--ink3)",
                      fontWeight: isToxic ? 700 : 400,
                      padding: "2px 8px", borderRadius: 8,
                    }}>{t.emotion}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.pnl >= 0 ? "var(--g)" : "var(--r)", minWidth: 50, textAlign: "right" }}>
                      {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(0)}{sym(currency)}
                    </span>
                  </div>
                );
              })}
              {lf && (
                <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 7, fontSize: 11, color: "var(--r)" }}>
                  Le <strong>{lf.emotion}</strong> t{"'"}a coûté <strong>−{lf.loss.toFixed(0)}{sym(currency)}</strong> ce mois
                </div>
              )}
            </div>
          )}
        </div>

        {/* Onboarding / Unlock / Discipline */}
        {isOnboarding ? (
          /* ── Onboarding en cours ── */
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Commence ton parcours MindTrade</div>
            <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 16 }}>3 actions pour débloquer toutes tes analyses</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { step: 1, done: checkins.length >= 1, label: "Premier check-in", desc: "2 min pour calibrer ton score mental.", href: "/dashboard/checkin", cta: "Commencer →" },
                { step: 2, done: trades.length >= 1, label: "Premier trade loggé", desc: "Active les stats et la corrélation.", href: "/dashboard/trades", cta: "Logger →" },
                { step: 3, done: checkins.length >= 3, label: "3 check-ins consécutifs", desc: "Débloque le graphique et les analyses.", href: "/dashboard/checkin", cta: "Continuer →" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: 9, background: s.done ? "rgba(52,196,90,.06)" : "var(--bg2)", border: `1px solid ${s.done ? "rgba(52,196,90,.2)" : "var(--border)"}` }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.done ? "var(--g)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.done ? <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span> : <span style={{ color: "var(--ink3)", fontSize: 11, fontWeight: 700 }}>{s.step}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.done ? "var(--g)" : "var(--ink)" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 1 }}>{s.desc}</div>
                  </div>
                  {!s.done && (
                    <a href={s.href} style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)", textDecoration: "none", background: "var(--tint-n-bg)", padding: "5px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>{s.cta}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : showUnlocked ? (
          /* ── Moment de déverrouillage — vu une seule fois ── */
          <div style={{ background: "linear-gradient(145deg, #0f2744 0%, #1a3a5c 60%, #0f2744 100%)", borderRadius: 14, padding: "24px", position: "relative", overflow: "hidden" }}>
            {/* Cercle décoratif */}
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(212,168,50,.08)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(77,142,248,.06)", pointerEvents: "none" }} />

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,168,50,.15)", border: "1px solid rgba(212,168,50,.3)", borderRadius: 20, padding: "4px 12px", marginBottom: 16 }}>
              <span style={{ fontSize: 10 }}>✦</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".12em" }}>Analyses débloquées</span>
            </div>

            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, color: "#fff", marginBottom: 6, lineHeight: 1.3 }}>
              Ton dashboard est maintenant complet
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 20, lineHeight: 1.6 }}>
              3 check-ins effectués. Toutes les analyses MindTrade sont actives.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                { icon: "📈", label: "Graphique score mental 7 jours" },
                { icon: "🎯", label: "Facteur limitant personnalisé" },
                { icon: "🧮", label: "Score de discipline 28 jours" },
                { icon: "📊", label: "Corrélation émotion / performance" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(52,196,90,.2)", border: "1px solid rgba(52,196,90,.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "var(--g)", fontSize: 9, fontWeight: 900 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={dismissUnlocked}
              style={{ width: "100%", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "var(--font-outfit)", letterSpacing: ".01em" }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,.16)")}
              onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,.1)")}
            >
              Découvrir mon dashboard →
            </button>
          </div>
        ) : (
          /* ── Score de discipline — état normal ── */
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Score de discipline</div>
                <div style={{ fontSize: 11, color: "var(--ink3)" }}>28 derniers jours</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 44, fontWeight: 700, lineHeight: 1, color: dColor }}>{disciplineScore}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: dColor, marginTop: 2 }}>{dLabel}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Régularité check-ins", val: dFactors[0] },
                ...(dFactors.length > 1 ? [{ label: "Règles respectées", val: dFactors[1] }] : []),
                ...(dFactors.length > 2 ? [{ label: "Maîtrise émotionnelle", val: dFactors[2] }] : []),
              ].map((f, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "var(--ink2)" }}>{f.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: f.val >= 80 ? "var(--g)" : f.val >= 60 ? "var(--a)" : "var(--r)" }}>{f.val}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg3)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${f.val}%`, background: f.val >= 80 ? "var(--g)" : f.val >= 60 ? "var(--a)" : "var(--r)", borderRadius: 3, transition: "width .5s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
