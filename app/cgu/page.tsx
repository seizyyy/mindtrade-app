export default function CGU() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", fontFamily: "var(--font-outfit)", color: "var(--ink)" }}>
      <a href="/" style={{ fontSize: 13, color: "var(--ink3)", textDecoration: "none", display: "inline-block", marginBottom: 40 }}>← Retour au site</a>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Conditions Générales d{"'"}Utilisation</h1>
      <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 48 }}>Dernière mise à jour : avril 2026</p>

      {[
        {
          title: "1. Objet",
          content: `Les présentes CGU régissent l'utilisation du service MindTrade, accessible sur mindtrade.app. En créant un compte, l'utilisateur accepte les présentes conditions dans leur intégralité.`,
        },
        {
          title: "2. Description du service",
          content: `MindTrade est un outil d'aide à la décision psychologique pour traders. Il permet de réaliser des check-ins mentaux quotidiens, de journaliser ses trades et d'analyser ses patterns comportementaux. Il ne constitue en aucun cas un conseil financier ou d'investissement.`,
        },
        {
          title: "3. Accès et compte",
          content: `L'accès au service complet est conditionné à la création d'un compte et à la souscription d'un abonnement payant. L'utilisateur est responsable de la confidentialité de ses identifiants. Tout accès frauduleux ou abusif pourra entraîner la résiliation du compte.`,
        },
        {
          title: "4. Tarifs et paiement",
          content: `Les abonnements sont disponibles en formule mensuelle (39€/mois), annuelle (290€/an) ou à vie (597€ paiement unique). Les paiements sont traités via Stripe. Les prix s'entendent TTC.`,
        },
        {
          title: "5. Garantie remboursement",
          content: `Une garantie de remboursement intégral de 14 jours est offerte sur tous les plans, sans condition ni question. Pour en bénéficier, il suffit d'envoyer un email à support@mindtrade.co dans ce délai.`,
        },
        {
          title: "6. Données personnelles",
          content: `Les données saisies dans MindTrade (check-ins, trades, journal) sont strictement privées et ne sont jamais partagées avec des tiers. Voir notre politique de confidentialité pour plus de détails.`,
        },
        {
          title: "7. Propriété intellectuelle",
          content: `L'utilisateur conserve la propriété de ses données. MindTrade conserve la propriété de sa plateforme, de ses algorithmes et de son design.`,
        },
        {
          title: "8. Résiliation",
          content: `L'utilisateur peut résilier son abonnement mensuel à tout moment, sans frais. Les abonnements annuels et lifetime ne sont pas remboursables au-delà des 14 jours de garantie.`,
        },
        {
          title: "9. Droit applicable",
          content: `Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux juridictions compétentes.`,
        },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8 }}>{s.content}</p>
        </div>
      ))}
    </div>
  );
}
