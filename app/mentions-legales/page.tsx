export default function MentionsLegales() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", fontFamily: "var(--font-outfit)", color: "var(--ink)" }}>
      <a href="/" style={{ fontSize: 13, color: "var(--ink3)", textDecoration: "none", display: "inline-block", marginBottom: 40 }}>← Retour au site</a>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Mentions légales</h1>
      <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 48 }}>Dernière mise à jour : avril 2026</p>

      {[
        {
          title: "Éditeur du site",
          content: `MindTrade est édité par une entreprise individuelle.\nContact : support@mindtrade.co`,
        },
        {
          title: "Hébergement",
          content: `Le site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.\nLa base de données est hébergée par Supabase (infrastructure AWS EU).`,
        },
        {
          title: "Propriété intellectuelle",
          content: `L'ensemble des contenus présents sur MindTrade (textes, graphiques, logos, icônes, logiciels) sont protégés par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.`,
        },
        {
          title: "Limitation de responsabilité",
          content: `MindTrade est un outil d'aide à la décision psychologique pour traders. Il ne constitue en aucun cas un conseil financier, d'investissement ou de trading. Les performances passées ne préjugent pas des performances futures. L'utilisateur reste seul responsable de ses décisions de trading.`,
        },
        {
          title: "Contact",
          content: `Pour toute question : support@mindtrade.co`,
        },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
        </div>
      ))}
    </div>
  );
}
