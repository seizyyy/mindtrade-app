"use client";

import { useState } from "react";

const questions = [
  {
    q: "Depuis combien de temps trades-tu ?",
    opts: ["Moins d'1 an", "1 à 3 ans", "3 à 5 ans", "Plus de 5 ans"],
  },
  {
    q: "Quel est ton plus grand frein en ce moment ?",
    opts: ["Je coupe mes stops trop tôt", "Je fais du revenge trading", "Je manque de discipline", "Je gère mal mes émotions"],
  },
  {
    q: "Sur quels marchés trades-tu ?",
    opts: ["Forex", "Indices / Futures", "Actions", "Crypto"],
  },
  {
    q: "Tu utilises quoi pour suivre tes trades ?",
    opts: ["Rien du tout", "Excel", "Notion", "Un journal payant", "Juste ma mémoire"],
  },
];

type Profile = {
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
  insight: string;
  cta: string;
};

function getProfile(answers: number[]): Profile {
  const frein = answers[1]; // 0=stops, 1=revenge, 2=discipline, 3=emotions
  const exp = answers[0];   // 0=<1an, 1=1-3, 2=3-5, 3=>5ans
  const tools = answers[3]; // 0=rien, 1=excel, 2=notion, 3=journal, 4=memoire

  if (frein === 1) return {
    label: "Trader émotionnel",
    emoji: "🔥",
    color: "#9b1c1c",
    bg: "rgba(155,28,28,.06)",
    border: "rgba(155,28,28,.15)",
    desc: "Tu as les connaissances — mais tes émotions sabotent tes décisions au pire moment. Revenge trading, FOMO, overtrading après une perte.",
    insight: "Les traders avec ce profil perdent en moyenne 40% de leur capital annuel sur des trades émotionnels identifiables.",
    cta: "Voir comment MindTrade stoppe le revenge trading →",
  };

  if (frein === 2 || (exp >= 2 && tools <= 2)) return {
    label: "Analyste sans exécution",
    emoji: "🎯",
    color: "#92400e",
    bg: "rgba(146,64,14,.06)",
    border: "rgba(146,64,14,.15)",
    desc: "Ton analyse est bonne, tes setups sont solides — mais tu n'arrives pas à appliquer tes règles de façon consistante. Le problème n'est pas technique.",
    insight: "Ce profil est le plus fréquent chez les traders de 2-5 ans. La solution n'est pas un meilleur système — c'est une meilleure discipline.",
    cta: "Voir comment MindTrade structure ta discipline →",
  };

  if (exp === 0 || tools === 0 || tools === 4) return {
    label: "Trader en construction",
    emoji: "🚀",
    color: "#1e40af",
    bg: "rgba(30,64,175,.06)",
    border: "rgba(30,64,175,.15)",
    desc: "Tu es dans la phase la plus décisive de ton parcours. Les habitudes que tu prends maintenant vont définir ton trading pour les 10 prochaines années.",
    insight: "Les traders qui structurent leur psychologie dès le début progressent 3x plus vite que ceux qui le font après des années de pertes.",
    cta: "Commencer avec les bonnes habitudes →",
  };

  return {
    label: "Trader confirmé en plateau",
    emoji: "📈",
    color: "#166534",
    bg: "rgba(22,101,52,.06)",
    border: "rgba(22,101,52,.15)",
    desc: "Tu es profitable — mais tu stagues. Tu sais que la prochaine étape n'est pas un meilleur setup, c'est une meilleure gestion de toi-même.",
    insight: "Les traders expérimentés qui ajoutent un suivi psychologique augmentent leur win rate de 15 à 25% en moyenne sur 6 mois.",
    cta: "Franchir le prochain palier →",
  };
}

export default function QuizLead() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0=intro 1-4=questions 5=loading 6=result
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const profile = answers.length === 4 ? getProfile(answers) : null;

  function openQuiz() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setOpen(true);
  }

  function closeQuiz() {
    setOpen(false);
    setTimeout(() => { setStep(0); setAnswers([]); setSelected(null); }, 300);
  }

  function nextStep() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(5);
      setTimeout(() => setStep(6), 2200);
    }
  }

  const qIndex = step - 1;

  return (
    <>
      {/* Section landing */}
      <section id="diagnostic" style={{ padding: "96px 5%", background: "var(--bg)", scrollMarginTop: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            {/* Left */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Diagnostic gratuit</div>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 16 }}>
                Quel type de trader<br />es-tu vraiment ?
              </h2>
              <p style={{ fontSize: 16, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
                4 questions · 60 secondes · Reçois ton profil psychologique de trader et les points précis qui freinent ta performance.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {["Trader émotionnel", "Analyste sans exécution", "Trader en construction", "Trader confirmé en plateau"].map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--ink2)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--navy)", flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
              <button onClick={openQuiz} style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "15px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Découvrir mon profil →
              </button>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 10 }}>Gratuit · Aucune inscription requise pour commencer</div>
            </div>

            {/* Right — preview card */}
            <div style={{ position: "relative" }}>
              {/* Glow */}
              <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 300, background: "radial-gradient(ellipse, rgba(155,28,28,.08) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", background: "#0f172a", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.25)" }}>

                {/* Header */}
                <div style={{ padding: "24px 28px 0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 20 }}>Exemple de profil</div>

                  {/* Profil badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "rgba(155,28,28,.12)", border: "1px solid rgba(155,28,28,.25)", borderRadius: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(155,28,28,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔥</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fca5a5" }}>Trader émotionnel</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 3 }}>Profil identifié · 38% des traders</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: "rgba(155,28,28,.2)", border: "1px solid rgba(155,28,28,.3)", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: "#fca5a5", whiteSpace: "nowrap" }}>Actif</div>
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 20 }}>
                    Tu as les connaissances — mais tes émotions sabotent tes décisions au pire moment.
                  </div>

                  {/* Insight */}
                  <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Insight clé</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>
                      Les traders avec ce profil perdent en moyenne <strong style={{ color: "#fff" }}>40% de leur capital annuel</strong> sur des trades émotionnels identifiables.
                    </div>
                  </div>
                </div>

                {/* Blurred footer */}
                <div style={{ padding: "0 28px 0", filter: "blur(5px)", opacity: 0.3, pointerEvents: "none" }}>
                  <div style={{ height: 9, background: "rgba(255,255,255,.12)", borderRadius: 4, marginBottom: 7, width: "75%" }} />
                  <div style={{ height: 9, background: "rgba(255,255,255,.12)", borderRadius: 4, width: "55%" }} />
                </div>

                {/* CTA footer */}
                <div style={{ padding: "16px 28px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.06)", marginTop: 16 }}>
                  <button onClick={openQuiz} style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    Découvrir mon profil →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div onClick={closeQuiz} style={{ position: "fixed", inset: 0, background: "rgba(12,12,10,.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 520, padding: "40px", position: "relative", boxShadow: "0 32px 80px rgba(12,12,10,.2)", margin: "0 16px" }}>
            <button onClick={closeQuiz} style={{ position: "absolute", top: 16, right: 16, background: "var(--bg2)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "var(--ink2)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>

            {/* INTRO */}
            {step === 0 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🧠</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, color: "var(--ink)", marginBottom: 10 }}>Ton profil de trader</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 28 }}>
                  4 questions pour identifier exactement ce qui freine ta performance — et comment y remédier.
                </p>
                <button onClick={() => setStep(1)} style={{ width: "100%", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Commencer →
                </button>
              </div>
            )}

            {/* QUESTIONS */}
            {step >= 1 && step <= 4 && (
              <>
                {/* Progress bar */}
                <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
                  {questions.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < qIndex ? "var(--navy)" : i === qIndex ? "var(--navy)" : "var(--bg3)", opacity: i === qIndex ? 0.4 : 1 }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>Question {step} sur 4</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--ink)", marginBottom: 24, lineHeight: 1.3 }}>
                  {questions[qIndex].q}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {questions[qIndex].opts.map((opt, i) => (
                    <button key={i} onClick={() => setSelected(i)} style={{
                      padding: "13px 16px", border: `1.5px solid ${selected === i ? "var(--navy)" : "var(--border)"}`,
                      borderRadius: 8, cursor: "pointer", fontSize: 14,
                      fontWeight: selected === i ? 600 : 500,
                      color: selected === i ? "var(--navy)" : "var(--ink2)",
                      background: selected === i ? "rgba(15,39,68,.06)" : "none",
                      fontFamily: "var(--font-outfit)", textAlign: "left", transition: "all .1s",
                    }}>
                      {opt}
                    </button>
                  ))}
                </div>
                <button onClick={nextStep} disabled={selected === null} style={{
                  width: "100%", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "13px",
                  fontSize: 14, fontWeight: 600, cursor: selected === null ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-outfit)", opacity: selected === null ? 0.3 : 1, transition: "opacity .12s",
                }}>
                  {step === 4 ? "Voir mon profil →" : "Suivant →"}
                </button>
              </>
            )}

            {/* LOADING */}
            {step === 5 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>⚙️</div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>Analyse en cours…</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 24 }}>On croise tes réponses avec les patterns des 312 traders sur MindTrade.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--navy)", animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* RESULT */}
            {step === 6 && profile && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "16px", background: profile.bg, border: `1.5px solid ${profile.border}`, borderRadius: 12 }}>
                  <div style={{ fontSize: 32 }}>{profile.emoji}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: profile.color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 2 }}>Ton profil</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--ink)" }}>{profile.label}</div>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 14 }}>{profile.desc}</p>

                <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Insight clé</div>
                  <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>{profile.insight}</div>
                </div>

                <a href="#acces" onClick={closeQuiz} style={{ display: "block", textAlign: "center", width: "100%", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", marginBottom: 10, textDecoration: "none", boxSizing: "border-box" }}>
                  {profile.cta}
                </a>
                <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink3)" }}>
                  Accès immédiat · Remboursé 14j sans question
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
