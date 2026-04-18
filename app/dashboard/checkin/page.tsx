"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const questions = [
  {
    key: "sommeil",
    label: "Sommeil",
    question: "Combien d'heures as-tu dormi cette nuit ?",
    opts: [
      { val: 1, emoji: "💀", label: "Moins de 5h" },
      { val: 2, emoji: "😴", label: "5 – 6h" },
      { val: 3, emoji: "😐", label: "6 – 7h" },
      { val: 4, emoji: "😊", label: "7 – 8h" },
      { val: 5, emoji: "⚡", label: "8h ou plus" },
    ],
  },
  {
    key: "energie",
    label: "Niveau d'énergie",
    question: "Comment te sens-tu physiquement ce matin ?",
    opts: [
      { val: 1, emoji: "😴", label: "Épuisé" },
      { val: 2, emoji: "😪", label: "Fatigué" },
      { val: 3, emoji: "😐", label: "Neutre" },
      { val: 4, emoji: "😊", label: "Bien" },
      { val: 5, emoji: "⚡", label: "Excellent" },
    ],
  },
  {
    key: "focus",
    label: "Concentration",
    question: "Ta capacité à te concentrer aujourd'hui ?",
    opts: [
      { val: 1, emoji: "😵", label: "Nulle" },
      { val: 2, emoji: "🤔", label: "Faible" },
      { val: 3, emoji: "😐", label: "Correcte" },
      { val: 4, emoji: "🎯", label: "Bonne" },
      { val: 5, emoji: "🧠", label: "Optimale" },
    ],
  },
  {
    key: "stress",
    label: "Stress / Anxiété",
    question: "Quel est ton niveau de stress en ce moment ?",
    opts: [
      { val: 1, emoji: "😌", label: "Zéro" },
      { val: 2, emoji: "🙂", label: "Léger" },
      { val: 3, emoji: "😐", label: "Modéré" },
      { val: 4, emoji: "😤", label: "Élevé" },
      { val: 5, emoji: "😰", label: "Intense" },
    ],
  },
  {
    key: "confiance",
    label: "Confiance",
    question: "Ta confiance en tes analyses aujourd'hui ?",
    opts: [
      { val: 1, emoji: "😟", label: "Aucune" },
      { val: 2, emoji: "😕", label: "Faible" },
      { val: 3, emoji: "😐", label: "Correcte" },
      { val: 4, emoji: "😊", label: "Bonne" },
      { val: 5, emoji: "💪", label: "Solide" },
    ],
  },
];

function calcScore(answers: Record<string, number>) {
  // Valeurs par défaut neutres (milieu de l'échelle) pour éviter de pénaliser les questions non répondues
  const { sommeil = 3, energie = 3, focus = 3, stress = 3, confiance = 3 } = answers;
  return Math.round(((sommeil + energie + focus + (6 - stress) + confiance) / 25) * 100);
}

function getVerdict(score: number) {
  if (score >= 75) return { label: "État optimal", color: "var(--g)", bg: "var(--tint-g-bg)", border: "var(--tint-g-border)", hint: "Tu es dans les meilleures conditions. Applique ta stratégie avec discipline.", icon: "✓" };
  if (score >= 60) return { label: "Attention requise", color: "var(--a)", bg: "var(--tint-a-bg)", border: "var(--tint-a-border)", hint: "Tu peux trader — reste attentif, analyse chaque entrée, réduis la taille.", icon: "⚠" };
  return { label: "Évite de trader", color: "var(--r)", bg: "var(--tint-r-bg)", border: "var(--tint-r-border)", hint: "Risque émotionnel trop élevé. Ferme le terminal et reviens demain.", icon: "✕" };
}

function getSleepWarning(sommeil: number | undefined) {
  if (!sommeil || sommeil >= 3) return null;
  if (sommeil === 1) return "Moins de 5h de sommeil altère fortement le cortex préfrontal — tes décisions seront biaisées. Évite de trader aujourd'hui.";
  return "5-6h de sommeil réduisent ta capacité de concentration de 20%. Réduis ta taille de position.";
}

export default function CheckinPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [existingScore, setExistingScore] = useState<number | null>(null);
  const [checkins, setCheckins] = useState<{ date: string; score: number }[]>([]);
  const [displayName, setDisplayName] = useState<string>("");
  const [maxRiskAmount, setMaxRiskAmount] = useState<number | null>(null);
  const [maxDailyLossAmount, setMaxDailyLossAmount] = useState<number | null>(null);
  const [accountSize, setAccountSize] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("EUR");
  const [todayPnl, setTodayPnl] = useState<number>(0);

  const today = new Date().toISOString().split("T")[0];
  const dayOfWeek = new Date().getDay(); // 0 = dimanche, 6 = samedi
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const [{ data: todayData }, { data: histData }, { data: profile }, { data: todayTrades }] = await Promise.all([
        supabase.from("checkins").select("score").eq("user_id", user.id).eq("date", today).single(),
        supabase.from("checkins").select("score,date").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
        supabase.from("profiles").select("display_name,max_risk_per_trade,max_daily_loss,account_size,currency").eq("id", user.id).single(),
        supabase.from("trades").select("pnl").eq("user_id", user.id).eq("date", today),
      ]);
      if (todayData) { setAlreadyDone(true); setExistingScore(todayData.score); setStep(5); }
      setCheckins(histData || []);
      if (profile?.display_name) setDisplayName(profile.display_name);
      if (profile?.max_risk_per_trade) setMaxRiskAmount(profile.max_risk_per_trade);
      if (profile?.max_daily_loss) setMaxDailyLossAmount(profile.max_daily_loss);
      if (profile?.account_size) setAccountSize(profile.account_size);
      if (profile?.currency) setCurrency(profile.currency);
      const pnl = (todayTrades || []).reduce((s: number, t: { pnl: number }) => s + t.pnl, 0);
      setTodayPnl(pnl);
    }
    check();
  }, []);

  const currentQ = questions[step];
  const score = step === 5 ? calcScore(answers) : 0;
  const verdict = step === 5 ? getVerdict(alreadyDone && existingScore ? existingScore : score) : null;
  const displayScore = alreadyDone && existingScore ? existingScore : score;
  const sleepWarning = getSleepWarning(answers.sommeil);

  // Alerte règles de risque
  const dailyLossReached = maxDailyLossAmount !== null && todayPnl < 0 && Math.abs(todayPnl) >= maxDailyLossAmount;
  const dailyLossClose = maxDailyLossAmount !== null && todayPnl < 0 && Math.abs(todayPnl) >= maxDailyLossAmount * 0.75 && !dailyLossReached;

  function selectAndNext(val: number) {
    const newAnswers = { ...answers, [currentQ.key]: val };
    setAnswers(newAnswers);

    if (step < 4) {
      setStep(step + 1);
    } else {
      setSaving(true);
      saveCheckin(newAnswers);
    }
  }

  async function saveCheckin(a: Record<string, number>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("checkins").upsert({
      user_id: user.id,
      date: today,
      sommeil: a.sommeil,
      energie: a.energie,
      focus: a.focus,
      stress: a.stress,
      confiance: a.confiance,
    }, { onConflict: "user_id,date" });
    setSaving(false);
    setStep(5);
  }

  if (alreadyDone && step < 5) return null;

  return (
    <div style={{ maxWidth: step === 5 ? 900 : 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

      {isWeekend && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "48px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
            {displayName ? `Bon week-end, ${displayName}.` : "Bon week-end."}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.8, maxWidth: 400, margin: "0 auto 28px" }}>
            Les marchés sont fermés — c'est le bon moment pour <strong style={{ color: "var(--ink)" }}>relire ta semaine</strong>, identifier ce qui a fonctionné, et <strong style={{ color: "var(--ink)" }}>préparer celle qui arrive</strong>. Le check-in reprend lundi.
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/dashboard/rapport" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 8, background: "var(--navy)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
              Voir mon rapport →
            </a>
            <a href="/dashboard/journal" style={{ display: "inline-block", padding: "11px 24px", borderRadius: 8, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--ink)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Écrire dans mon journal →
            </a>
          </div>
        </div>
      )}

      {!isWeekend && <>
      <div style={{ marginBottom: 4, fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Check-in mental</div>
      <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 20, fontWeight: 400 }}>
        {displayName ? <>Bonjour <strong style={{ color: "var(--ink)", fontWeight: 800 }}>{displayName}</strong> — réponds honnêtement, tes réponses restent privées.</> : "Réponds honnêtement — tes réponses restent privées."}
      </div>

      <div style={step === 5
        ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }
        : {}
      }>

        {/* Colonne gauche : card principale */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 32px" }}>

        {step === 5 ? (
          <div>
            {alreadyDone && (
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16, background: "var(--bg2)", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                Check-in déjà effectué aujourd{"'"}hui
              </div>
            )}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
                Ton score mental aujourd{"'"}hui
              </div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 72, fontWeight: 700, color: verdict!.color, lineHeight: 1 }}>{displayScore}</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>/100</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdict!.bg, border: `1.5px solid ${verdict!.border}`, borderRadius: 20, padding: "7px 20px" }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: verdict!.color }}>{verdict!.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: verdict!.color }}>{verdict!.label}</span>
              </div>
            </div>

            <div style={{ background: verdict!.bg, border: `1px solid ${verdict!.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7 }}>{verdict!.hint}</div>
            </div>

            {/* Alerte sommeil */}
            {sleepWarning && (
              <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--r)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>⚠ Alerte sommeil</div>
                <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>{sleepWarning}</div>
              </div>
            )}

            {/* Alerte règles de risque */}
            {dailyLossReached && (
              <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--r)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>⛔ Limite journalière atteinte</div>
                <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7 }}>
                  Tu as perdu <strong style={{ color: "var(--r)" }}>{Math.abs(todayPnl).toFixed(0)} {currency}</strong> aujourd'hui — ta limite est fixée à <strong style={{ color: "var(--ink)" }}>{maxDailyLossAmount!.toFixed(0)} {currency}</strong>. <strong>Arrête de trader maintenant.</strong> Revenir demain avec un état d'esprit frais est toujours plus rentable que de tenter de récupérer.
                </div>
              </div>
            )}
            {dailyLossClose && !dailyLossReached && (
              <div style={{ background: "var(--tint-a-bg)", border: "1px solid var(--tint-a-border)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--a)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>⚠ Limite journalière proche</div>
                <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7 }}>
                  Tu as perdu <strong style={{ color: "var(--a)" }}>{Math.abs(todayPnl).toFixed(0)} {currency}</strong> sur ta limite de <strong style={{ color: "var(--ink)" }}>{maxDailyLossAmount!.toFixed(0)} {currency}</strong>. Il te reste <strong style={{ color: "var(--ink)" }}>{(maxDailyLossAmount! - Math.abs(todayPnl)).toFixed(0)} {currency}</strong> avant la limite — trade uniquement tes meilleurs setups.
                </div>
              </div>
            )}
            {maxRiskAmount && !dailyLossReached && (
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Rappel risque</div>
                <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>
                  Risque max par trade : <strong style={{ color: "var(--ink)" }}>{maxRiskAmount.toFixed(0)} {currency}</strong>
                </div>
              </div>
            )}

            {/* Détail */}
            {!alreadyDone && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Détail</div>
                {questions.map(q => {
                  const val = answers[q.key];
                  const opt = q.opts.find(o => o.val === val);
                  const isStress = q.key === "stress";
                  const pct = isStress ? ((6 - val) / 5) * 100 : (val / 5) * 100;
                  return (
                    <div key={q.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>{opt?.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "var(--ink2)" }}>{q.label}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{opt?.label}</span>
                        </div>
                        <div style={{ height: 4, background: "var(--bg3)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? "var(--g)" : pct >= 40 ? "var(--a)" : "var(--r)", borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <a href="/dashboard" style={{ flex: 1, display: "block", textAlign: "center", background: "var(--navy)", color: "#fff", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Aller au dashboard →
              </a>
              <a href="/dashboard/trades" style={{ flex: 1, display: "block", textAlign: "center", background: "var(--bg2)", color: "var(--ink)", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid var(--border)" }}>
                Logger un trade
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? "var(--navy)" : i === step ? "var(--navy)" : "var(--bg3)", opacity: i === step ? 0.4 : 1 }} />
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", marginBottom: 6 }}>Question {step + 1} sur 5 · {currentQ.label}</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, color: "var(--ink)", marginBottom: 22, lineHeight: 1.3 }}>
              {currentQ.question}
            </div>

            {/* Info sommeil */}
            {currentQ.key === "sommeil" && (
              <div style={{ fontSize: 12, color: "var(--ink3)", background: "var(--bg2)", borderRadius: 8, padding: "8px 12px", marginBottom: 14, lineHeight: 1.5 }}>
                Le sommeil est le facteur n°1 de qualité de décision. Sois honnête.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentQ.opts.map(opt => (
                <button
                  key={opt.val}
                  onClick={() => selectAndNext(opt.val)}
                  disabled={saving}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", border: "1.5px solid var(--border)",
                    borderRadius: 8, cursor: "pointer", fontSize: 14,
                    fontWeight: 500, color: "var(--ink2)",
                    background: "var(--bg2)", fontFamily: "var(--font-outfit)",
                    textAlign: "left", transition: "all .1s", width: "100%",
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)";
                    (e.currentTarget as HTMLElement).style.background = "var(--tint-n-bg)";
                    (e.currentTarget as HTMLElement).style.color = "var(--navy)";
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg2)";
                    (e.currentTarget as HTMLElement).style.color = "var(--ink2)";
                  }}
                >
                  <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {saving && (
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--ink3)" }}>Sauvegarde...</div>
            )}
          </>
        )}
        </div>

        {/* Colonne droite : heatmap (uniquement sur l'écran résultat) */}
        {step === 5 && checkins.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Ton historique · 4 semaines</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>
                  {Math.round((checkins.filter(c => {
                    const d = new Date(); d.setDate(d.getDate() - 28);
                    return c.date >= d.toISOString().split("T")[0];
                  }).length / 28) * 100)}% complétion
                </span>
              </div>
              <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                {["L","M","M","J","V","S","D"].map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--ink3)", fontWeight: 600 }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {Array.from({ length: 28 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (27 - i));
                  const dateStr = date.toISOString().split("T")[0];
                  const ci = checkins.find(c => c.date === dateStr);
                  const isToday = dateStr === today;
                  const bg = isToday
                    ? (ci
                      ? ci.score >= 75 ? "#22c55e" : ci.score >= 60 ? "#f59e0b" : "#ef4444"
                      : "rgba(59,130,246,0.2)")
                    : ci
                    ? ci.score >= 75 ? "#4ade80" : ci.score >= 60 ? "#fbbf24" : "#f87171"
                    : "var(--bg3)";
                  const borderColor = isToday
                    ? ci ? (ci.score >= 75 ? "#16a34a" : ci.score >= 60 ? "#f59e0b" : "#dc2626") : "#0a0a0a"
                    : "none";
                  return (
                    <div key={i} title={`${dateStr}${ci ? ` — Score : ${ci.score}` : " — Pas de check-in"}`}
                      style={{ aspectRatio: "1", borderRadius: 4, background: bg, border: isToday ? `2px solid ${borderColor}` : "none", boxShadow: isToday ? `0 0 0 1px ${borderColor}20` : "none" }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, fontSize: 11 }}>
                <span style={{ color: "#22c55e", fontWeight: 600 }}>● Optimal ≥75</span>
                <span style={{ color: "#f59e0b", fontWeight: 600 }}>● Attention 60–74</span>
                <span style={{ color: "#ef4444", fontWeight: 600 }}>● Bas &lt;60</span>
              </div>
            </div>

            {/* Streak + stats rapides */}
            {(() => {
              let streak = 0;
              const d = new Date();
              for (const ci of checkins) {
                if (ci.date === d.toISOString().split("T")[0]) { streak++; d.setDate(d.getDate() - 1); }
                else break;
              }
              const avg7 = checkins.length > 0
                ? Math.round(checkins.slice(0, 7).reduce((s, c) => s + c.score, 0) / Math.min(checkins.length, 7))
                : null;
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Streak actuel</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: streak > 0 ? "var(--navy)" : "var(--ink3)", lineHeight: 1 }}>
                      {streak > 0 ? `${streak}j` : "—"}
                    </div>
                    {streak > 0 && <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>🔥 en cours</div>}
                  </div>
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Moyenne 7j</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, lineHeight: 1, color: avg7 ? avg7 >= 75 ? "var(--g)" : avg7 >= 60 ? "var(--a)" : "var(--r)" : "var(--ink3)" }}>
                      {avg7 ?? "—"}
                    </div>
                    {avg7 && <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>sur 100</div>}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      </>}
    </div>
  );
}
