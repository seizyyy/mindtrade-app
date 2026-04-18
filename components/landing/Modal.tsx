"use client";

import { useState, useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

const questions = [
  { q: "Depuis combien de temps trades-tu ?", opts: ["Moins d'1 an", "1 à 3 ans", "3 à 5 ans", "Plus de 5 ans"] },
  { q: "Quel est ton plus grand défi en trading ?", opts: ["Respect de mes stops", "Revenge trading / FOMO", "Manque de discipline", "Gestion des émotions"] },
  { q: "Sur quels marchés trades-tu ?", opts: ["Forex", "Indices / Futures", "Actions", "Crypto"] },
  { q: "Utilises-tu déjà un journal de trading ?", opts: ["Non, jamais", "Oui, un spreadsheet", "Oui, un outil dédié", "J'essaie mais j'abandonne"] },
];

export default function Modal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(questions.length).fill(undefined));
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers(Array(questions.length).fill(undefined));
      setShowForm(false);
      setSubmitted(false);
      setName(""); setEmail(""); setMsg("");
    }
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  function selectOpt(i: number) {
    setAnswers(prev => { const next = [...prev]; next[step] = i; return next; });
  }

  function nextStep() {
    if (answers[step] === undefined) return;
    if (step < questions.length - 1) setStep(s => s + 1);
    else setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const currentQ = questions[step];
  const allDone = showForm || submitted;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(12,12,10,.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, width: "100%", maxWidth: 520, padding: 40, position: "relative", boxShadow: "0 32px 80px rgba(12,12,10,.2)", margin: "0 16px" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "var(--bg2)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "var(--ink2)", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>

        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: allDone || i < step ? "var(--navy)" : i === step ? "var(--navy)" : "var(--bg3)", opacity: !allDone && i === step ? 0.4 : 1 }} />
          ))}
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(22,101,52,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>✓</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, color: "var(--ink)", marginBottom: 8 }}>Candidature envoyée !</div>
            <div style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7 }}>Tu recevras une réponse sous 24h avec ton profil de trader et les détails d{"'"}accès.</div>
          </div>
        ) : showForm ? (
          <>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--ink)", marginBottom: 8 }}>Presque là 👋</div>
            <div style={{ fontSize: 14, color: "var(--ink2)", marginBottom: 20 }}>Dis-nous où t{"'"}envoyer ta réponse.</div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ton prénom" required
                  style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, fontFamily: "var(--font-outfit)", color: "var(--ink)", outline: "none", width: "100%" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ton email" required
                  style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, fontFamily: "var(--font-outfit)", color: "var(--ink)", outline: "none", width: "100%" }} />
              </div>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={3} placeholder="Pourquoi veux-tu rejoindre MindTrade ? (optionnel)"
                style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, fontFamily: "var(--font-outfit)", color: "var(--ink)", outline: "none", width: "100%", resize: "none", marginBottom: 10 }} />
              <button type="submit" style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: 13, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", width: "100%", marginTop: 4 }}>
                Envoyer →
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "var(--ink)", marginBottom: 8, lineHeight: 1.3 }}>{currentQ.q}</div>
            <div style={{ fontSize: 14, color: "var(--ink2)", marginBottom: 24 }}>Question {step + 1} sur {questions.length}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentQ.opts.map((opt, i) => (
                <button key={i} onClick={() => selectOpt(i)} style={{
                  padding: "13px 16px",
                  border: `1.5px solid ${answers[step] === i ? "var(--navy)" : "var(--border)"}`,
                  borderRadius: 8, cursor: "pointer", fontSize: 14,
                  fontWeight: answers[step] === i ? 600 : 500,
                  color: answers[step] === i ? "var(--navy)" : "var(--ink2)",
                  background: answers[step] === i ? "rgba(15,39,68,.06)" : "none",
                  fontFamily: "var(--font-outfit)", textAlign: "left", transition: "all .12s", width: "100%",
                }}>
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={nextStep} disabled={answers[step] === undefined} style={{
                background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px",
                fontSize: 14, fontWeight: 600, cursor: answers[step] === undefined ? "not-allowed" : "pointer",
                fontFamily: "var(--font-outfit)", opacity: answers[step] === undefined ? 0.3 : 1, transition: "opacity .12s",
              }}>
                {step === questions.length - 1 ? "Voir mon profil →" : "Suivant →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
