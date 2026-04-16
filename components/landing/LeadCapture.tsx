"use client";

import { useState } from "react";

export default function LeadCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lead_capture_section" }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section style={{ padding: "80px 5%", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, color: "var(--ink)", marginBottom: 10 }}>
              Tu es sur la liste !
            </div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7 }}>
              Vérifie ta boîte mail — la checklist arrive dans 2 minutes.
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "inline-block", background: "var(--bg3)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>
              Gratuit
            </div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 14, color: "var(--ink)" }}>
              Pas encore prêt à t{"'"}abonner ?
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
              Reçois gratuitement <strong style={{ color: "var(--ink)" }}>la Checklist Mentale du Trader</strong> — 12 questions à te poser avant chaque session pour trader dans le bon état.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto" }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Ton email" required
                style={{ flex: 1, background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontFamily: "var(--font-outfit)", color: "var(--ink)", outline: "none" }}
              />
              <button type="submit" disabled={loading} style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
                {loading ? "..." : "Recevoir →"}
              </button>
            </form>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 12 }}>
              Aucun spam. Désabonnement en 1 clic.
            </div>
          </>
        )}
      </div>
    </section>
  );
}
