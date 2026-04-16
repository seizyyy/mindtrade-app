"use client";

import { useState, useEffect } from "react";

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mt_exit_seen")) return;

    let triggered = false;
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 20 && !triggered) {
        triggered = true;
        setTimeout(() => setOpen(true), 200);
      }
    }
    // Also trigger on mobile after 40s
    const timer = setTimeout(() => {
      if (!triggered) { triggered = true; setOpen(true); }
    }, 40000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function close() {
    setOpen(false);
    localStorage.setItem("mt_exit_seen", "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent" }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
    localStorage.setItem("mt_exit_seen", "1");
  }

  if (!open) return null;

  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(12,12,10,.75)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 480, padding: "48px 44px", position: "relative", boxShadow: "0 40px 100px rgba(12,12,10,.3)", margin: "0 16px" }}>
        <button onClick={close} style={{ position: "absolute", top: 16, right: 16, background: "var(--bg2)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "var(--ink2)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>

        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, color: "var(--ink)", marginBottom: 10 }}>C{"'"}est dans ta boîte !</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7 }}>
              Vérifie tes spams si tu ne vois rien dans 2 minutes.
            </p>
            <button onClick={close} style={{ marginTop: 20, background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Retour au site →
            </button>
          </div>
        ) : (
          <>
            {/* Gift icon */}
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(15,39,68,.07)", border: "1px solid rgba(15,39,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>🎁</div>

            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, color: "var(--ink)", lineHeight: 1.15, marginBottom: 10 }}>
              Avant de partir —<br />un cadeau gratuit.
            </div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 24 }}>
              Reçois <strong style={{ color: "var(--ink)" }}>la Checklist Mentale du Trader</strong> — 12 questions à te poser avant d{"'"}ouvrir tes charts. Utilisée par les traders rentables.
            </p>

            {/* Social proof mini */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, background: "var(--bg2)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex" }}>
                {["TM","JL","AR"].map((init, i) => (
                  <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid var(--card)", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", marginLeft: i === 0 ? 0 : -8 }}>{init}</div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "var(--ink2)" }}><strong style={{ color: "var(--ink)" }}>312 traders</strong> ont déjà téléchargé ce guide</span>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Ton adresse email" required
                style={{ width: "100%", background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "13px 16px", fontSize: 14, fontFamily: "var(--font-outfit)", color: "var(--ink)", outline: "none", marginBottom: 10 }}
              />
              <button type="submit" disabled={loading} style={{ width: "100%", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Envoi..." : "Recevoir la checklist gratuite →"}
              </button>
            </form>
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink3)", marginTop: 10 }}>
              Aucun spam · Désabonnement en 1 clic
            </div>
          </>
        )}
      </div>
    </div>
  );
}
