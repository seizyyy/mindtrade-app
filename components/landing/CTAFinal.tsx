"use client";

export default function CTAFinal() {
  return (
    <section style={{ padding: "96px 5%", background: "var(--navy)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>

          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 16 }}>Commencer</div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff", marginBottom: 20 }}>
            Prêt à trader<br /><em style={{ fontStyle: "italic" }}>avec ton cerveau, pas contre lui ?</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.55)", lineHeight: 1.7, marginBottom: 44 }}>
            Rejoins 312 traders qui ont compris que la performance durable commence dans la tête. Accès immédiat. Remboursé 14 jours si pas convaincu.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="/register?plan=annual" style={{ background: "#fff", color: "var(--navy)", border: "none", borderRadius: 8, padding: "16px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", textDecoration: "none", display: "inline-block" }}>
                Démarrer — 290€/an →
              </a>
              <a href="/register?plan=lifetime" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#fff", border: "none", borderRadius: 8, padding: "16px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", textDecoration: "none", display: "inline-block" }}>
                Accès à vie — 597€ →
              </a>
            </div>
            <a href="/register?plan=monthly" style={{ fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none" }}>
              Commencer à 39€/mois sans engagement →
            </a>
          </div>

          {/* Trust */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
            {["🔒 Paiement sécurisé", "↩ Remboursé 14j", "⚡ Accès immédiat"].map(t => (
              <div key={t} style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
