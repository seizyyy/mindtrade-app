export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", padding: "60px 5% 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Colonnes principales */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 12 }}>MindTrade</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              Le copilote mental du trader sérieux. Score mental, signal mental, confluences — avant d{"'"}ouvrir les charts.
            </p>
            <a href="mailto:support@mindtrade.co" style={{ fontSize: 13, color: "rgba(255,255,255,.35)", textDecoration: "none" }}>
              support@mindtrade.co
            </a>
          </div>

          {/* Produit */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Produit</div>
            {[
              ["#fonctionnalites", "Fonctionnalités"],
              ["#pourquoi", "Pourquoi MindTrade"],
              ["#acces", "Tarifs"],
              ["/dashboard", "Accéder au dashboard"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none", marginBottom: 10, transition: "color .15s" }}
                onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,.75)")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.4)")}>
                {label}
              </a>
            ))}
          </div>

          {/* Aide */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Aide</div>
            {[
              ["#faq", "FAQ"],
              ["mailto:support@mindtrade.co", "Support"],
              ["mailto:support@mindtrade.co", "Remboursement"],
            ].map(([href, label]) => (
              <a key={label} href={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none", marginBottom: 10, transition: "color .15s" }}
                onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,.75)")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.4)")}>
                {label}
              </a>
            ))}
          </div>

          {/* Légal */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Légal</div>
            {[
              ["/mentions-legales", "Mentions légales"],
              ["/cgu", "CGU"],
              ["/confidentialite", "Confidentialité"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,.4)", textDecoration: "none", marginBottom: 10, transition: "color .15s" }}
                onMouseOver={e => (e.currentTarget.style.color = "rgba(255,255,255,.75)")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,.4)")}>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>
            © 2026 MindTrade · Tous droits réservés
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>
            Hébergé sur Vercel · Paiements sécurisés par Stripe
          </div>
        </div>

      </div>
    </footer>
  );
}
