export default function Confidentialite() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", fontFamily: "var(--font-outfit)", color: "var(--ink)" }}>
      <a href="/" style={{ fontSize: 13, color: "var(--ink3)", textDecoration: "none", display: "inline-block", marginBottom: 40 }}>← Retour au site</a>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Politique de confidentialité</h1>
      <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 48 }}>Dernière mise à jour : avril 2026</p>

      {[
        {
          title: "1. Données collectées",
          content: `MindTrade collecte uniquement les données nécessaires au fonctionnement du service :\n• Adresse email (création de compte)\n• Données de check-in : sommeil, énergie, focus, stress, confiance\n• Données de trading : paires, direction, P&L, état émotionnel\n• Journal de trading : notes personnelles\n• Préférences de compte : prénom/pseudo, taille du compte`,
        },
        {
          title: "2. Utilisation des données",
          content: `Ces données sont utilisées exclusivement pour :\n• Fournir le service MindTrade (scores, rapports, analyses)\n• Améliorer l'expérience utilisateur\n\nAucune donnée n'est vendue, partagée ou utilisée à des fins publicitaires.`,
        },
        {
          title: "3. Hébergement et sécurité",
          content: `Les données sont hébergées sur Supabase (infrastructure AWS Europe). Les communications sont chiffrées via HTTPS/TLS. Les mots de passe sont hashés et jamais stockés en clair. Les paiements sont traités par Stripe — nous n'avons jamais accès à vos informations bancaires.`,
        },
        {
          title: "4. Durée de conservation",
          content: `Les données sont conservées aussi longtemps que le compte est actif. En cas de résiliation, les données sont supprimées dans un délai de 30 jours sur simple demande à contact@mindtrade.app.`,
        },
        {
          title: "5. Vos droits (RGPD)",
          content: `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits : contact@mindtrade.app`,
        },
        {
          title: "6. Cookies",
          content: `MindTrade utilise uniquement des cookies techniques nécessaires au fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.`,
        },
        {
          title: "7. Contact",
          content: `Pour toute question relative à vos données personnelles : contact@mindtrade.app`,
        },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
        </div>
      ))}
    </div>
  );
}
