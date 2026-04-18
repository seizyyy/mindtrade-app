"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const questions = [
  { key: "energie", label: "Ton niveau d'énergie ce matin ?", emoji: ["😴 Épuisé", "😪 Fatigué", "😐 Neutre", "😊 Bien", "⚡ Excellent"] },
  { key: "focus", label: "Ta capacité à te concentrer ?", emoji: ["😵 Nulle", "🤔 Faible", "😐 Correcte", "🎯 Bonne", "🧠 Top"] },
  { key: "stress", label: "Ton niveau de stress / anxiété ?", emoji: ["😌 Zéro", "🙂 Léger", "😐 Modéré", "😤 Élevé", "😰 Intense"] },
  { key: "confiance", label: "Ta confiance en tes analyses ?", emoji: ["😟 Aucune", "😕 Faible", "😐 Correcte", "😊 Bonne", "💪 Solide"] },
];

const STORAGE_KEY = "mt-essai";

export default function EssaiGratuitPage() {
  const [step, setStep] = useState<number | "email" | "already">(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [lastDate, setLastDate] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setLastDate(parsed.date);
      if (parsed.date === today) {
        setStep("already");
      }
    }
  }, []);

  const qIndex = typeof step === "number" ? step - 1 : 0;
  const currentQ = questions[qIndex];

  const score = (() => {
    const vals = Object.values(answers);
    if (vals.length === 0) return 0;
    const stressVal = answers.stress || 3;
    const adjusted = vals.reduce((a, b) => a + b, 0) - stressVal + (6 - stressVal);
    return Math.round((adjusted / (vals.length * 5)) * 100);
  })();

  const verdict = score >= 75
    ? { label: "État optimal", color: "#166534", bg: "rgba(22,101,52,.08)", border: "rgba(22,101,52,.2)", advice: "Excellent état mental. Tu es dans les meilleures conditions pour trader. Applique ta stratégie avec discipline — les setups de qualité sont là pour être pris." }
    : score >= 55
    ? { label: "Attention requise", color: "#92400e", bg: "rgba(146,64,14,.08)", border: "rgba(146,64,14,.2)", advice: "Tu peux trader, mais reste vigilant. Évite les trades impulsifs, vérifie deux fois tes setups, et stop automatique après 2 pertes consécutives." }
    : { label: "Ne trade pas aujourd'hui", color: "#9b1c1c", bg: "rgba(155,28,28,.08)", border: "rgba(155,28,28,.2)", advice: "Ton état mental n'est pas favorable au trading. Les stats montrent que trader dans cet état coûte en moyenne 3x plus que les sessions reportées. Reviens demain." };

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailLoading(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, email }));
    const supabase = createClient();
    await supabase.from("leads").upsert({ email: email.trim(), score }, { onConflict: "email" });
    setEmailLoading(false);
    setStep(5);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <div style={{ padding: "0 5%", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <a href="/" style={{ fontFamily: "var(--font-montserrat)", fontSize: 15, fontWeight: 900, color: "var(--ink)", textDecoration: "none", letterSpacing: "-.4px" }}>MindTrade</a>
        <a href="/#acces" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", textDecoration: "none" }}>Voir les tarifs →</a>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 5%" }}>
        <div style={{ width: "100%", maxWidth: 500 }}>

          {/* DÉJÀ FAIT */}
          {step === "already" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(15,39,68,.07)", border: "1px solid rgba(15,39,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px" }}>🔒</div>
              <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 14, color: "var(--ink)" }}>
                Tu as déjà fait ton check-in aujourd'hui
              </h1>
              <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 32 }}>
                Le check-in est disponible une fois par jour. Pour accéder à ton score chaque matin — et à toutes les analyses — rejoins MindTrade.
              </p>
              <a href="/#acces" style={{ display: "inline-block", background: "var(--ink)", color: "#fff", borderRadius: 8, padding: "14px 32px", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)", marginBottom: 14 }}>
                Voir les offres →
              </a>
              <div style={{ fontSize: 13, color: "var(--ink3)" }}>
                <a href="/login" style={{ color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>J'ai déjà un compte →</a>
              </div>
            </div>
          )}

          {/* INTRO */}
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(15,39,68,.07)", border: "1px solid rgba(15,39,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px" }}>🧠</div>
              <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 14, color: "var(--ink)" }}>
                Ton check-in mental<br />gratuit
              </h1>
              <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
                4 questions · 90 secondes · Tu découvres ton score mental du jour et si tu devrais trader maintenant.
              </p>
              <button onClick={() => setStep(1)} style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "15px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                Commencer →
              </button>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 12 }}>Disponible une fois par jour</div>
            </div>
          )}

          {/* QUESTIONS */}
          {typeof step === "number" && step >= 1 && step <= 4 && (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
                {questions.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < qIndex ? "var(--navy)" : i === qIndex ? "var(--navy)" : "var(--bg3)", opacity: i === qIndex ? 0.4 : 1 }} />
                ))}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>Question {step} sur 4</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, color: "var(--ink)", marginBottom: 28, lineHeight: 1.3 }}>
                {currentQ.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {currentQ.emoji.map((label, i) => (
                  <button key={i} onClick={() => {
                    const newAnswers = { ...answers, [currentQ.key]: i + 1 };
                    setAnswers(newAnswers);
                    setTimeout(() => {
                      if (step === 4) setStep("email");
                      else setStep((s) => (typeof s === "number" ? s + 1 : s));
                    }, 180);
                  }} style={{
                    padding: "13px 16px", border: `1.5px solid ${answers[currentQ.key] === i + 1 ? "var(--navy)" : "var(--border)"}`,
                    borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: answers[currentQ.key] === i + 1 ? 600 : 500,
                    color: answers[currentQ.key] === i + 1 ? "var(--navy)" : "var(--ink2)",
                    background: answers[currentQ.key] === i + 1 ? "rgba(15,39,68,.06)" : "var(--card)",
                    fontFamily: "var(--font-outfit)", textAlign: "left", transition: "all .1s",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CAPTURE EMAIL */}
          {step === "email" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(15,39,68,.07)", border: "1px solid rgba(15,39,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 20px" }}>📬</div>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-.02em", marginBottom: 10, color: "var(--ink)" }}>
                Ton score est prêt
              </h2>
              <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
                Entre ton email pour débloquer ton résultat — il s'affiche immédiatement ici.
              </p>
              <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email"
                  required
                  placeholder="ton@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ padding: "13px 16px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 14, color: "var(--ink)", background: "var(--card)", fontFamily: "var(--font-outfit)", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
                <button
                  type="submit"
                  disabled={emailLoading}
                  style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: emailLoading ? "default" : "pointer", fontFamily: "var(--font-outfit)", opacity: emailLoading ? 0.7 : 1 }}
                >
                  {emailLoading ? "Calcul en cours…" : "Voir mon score →"}
                </button>
              </form>
              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 10 }}>Pas de spam. Désabonnement en 1 clic.</div>
            </div>
          )}

          {/* RÉSULTAT */}
          {step === 5 && (
            <div>
              <div style={{ background: "var(--card)", border: `1.5px solid ${verdict.border}`, borderRadius: 16, padding: "28px 28px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: verdict.color, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Ton score mental aujourd{"'"}hui</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 72, fontWeight: 700, color: verdict.color, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 16 }}>/100</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: verdict.bg, border: `1.5px solid ${verdict.border}`, borderRadius: 20, padding: "7px 18px" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: verdict.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: verdict.color }}>{verdict.label}</span>
                </div>
              </div>

              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Conseil personnalisé</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, margin: 0 }}>{verdict.advice}</p>
              </div>

              {/* Upsell */}
              <div style={{ background: "linear-gradient(135deg, var(--navy), #1a3a5c)", borderRadius: 16, padding: "28px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.6)", marginBottom: 10 }}>MindTrade fait ça chaque jour — automatiquement.</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
                  Prêt à trader avec<br />la tête au bon endroit ?
                </div>
                <a href="/register?plan=annual" style={{ display: "inline-block", marginTop: 16, background: "#fff", color: "var(--navy)", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>
                  Commencer — 290€/an →
                </a>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 8 }}>Remboursé 14j si pas convaincu</div>
                <a href="/" style={{ display: "block", marginTop: 12, fontSize: 12, color: "rgba(255,255,255,.4)", textDecoration: "none" }}>
                  ← Retour au site
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
