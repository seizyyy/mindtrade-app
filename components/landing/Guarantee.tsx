export default function Guarantee() {
  return (
    <section style={{ padding: "64px 5%", background: "var(--bg)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 40,
          alignItems: "center",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "44px 48px",
          boxShadow: "var(--shadow-card)",
        }}>
          {/* Icône */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--navy), var(--navy2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, flexShrink: 0,
          }}>
            🛡️
          </div>

          {/* Texte */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Garantie sans risque</div>
            <h3 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 12, lineHeight: 1.2 }}>
              Remboursé intégralement sous 14 jours.<br />
              <em style={{ fontStyle: "italic", color: "var(--navy)" }}>Sans question, sans condition.</em>
            </h3>
            <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.7, maxWidth: 560 }}>
              Si MindTrade ne t{"'"}apporte pas de résultats mesurables dans les 14 premiers jours — meilleure discipline, biais identifiés, décisions plus claires — on te rembourse intégralement. Un email suffit.
            </p>
          </div>
        </div>

        {/* 3 mini-garanties */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
          {[
            { icon: "🔒", title: "Paiement 100% sécurisé", desc: "Transactions chiffrées via Stripe. Aucune donnée bancaire stockée." },
            { icon: "⚡", title: "Accès immédiat", desc: "Ton compte est actif dans les secondes qui suivent le paiement." },
            { icon: "📧", title: "Support réactif", desc: "Une question ? support@mindtrade.co — réponse sous 24h ouvrées." },
          ].map((g, i) => (
            <div key={i} style={{ background: "var(--bg2)", borderRadius: 10, padding: "20px 22px", display: "flex", gap: 14 }}>
              <span style={{ fontSize: 20 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.6 }}>{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
