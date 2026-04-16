const faqs = [
  {
    q: "Comment démarrer avec MindTrade ?",
    a: "Choisis ton plan, crée ton compte et accède immédiatement au dashboard. Le premier check-in prend moins de 2 minutes. Pas de configuration complexe, pas d'import de données — tu commences à tracker ton état mental dès aujourd'hui.",
  },
  {
    q: "C'est quoi la différence avec un journal classique ?",
    a: "Un journal classique analyse ce qui s'est passé. MindTrade intervient avant — avec un score mental, un signal mental, et des règles à respecter. Tu prends de meilleures décisions parce que tu sais dans quel état tu es avant d'ouvrir tes charts.",
  },
  {
    q: "Combien de temps ça prend par jour ?",
    a: "Le check-in : 2 minutes. Le log de trades : 30 secondes par trade. Le journal : 5 minutes en fin de session. En tout, moins de 10 minutes par jour. L'impact sur ta performance est disproportionné par rapport au temps investi.",
  },
  {
    q: "Faut-il connecter son broker ?",
    a: "Non. MindTrade fonctionne avec une saisie manuelle simple et rapide. L'import de trades est prévu dans les prochaines versions. La force de MindTrade ce sont les données psychologiques — pas le volume de trades.",
  },
  {
    q: "Pour quels marchés ?",
    a: "MindTrade est agnostique au marché — Forex, indices, actions, crypto, futures. La psychologie du trading ne change pas selon l'actif. Le FOMO sur l'EUR/USD est le même que le FOMO sur le Bitcoin.",
  },
  {
    q: "Et si MindTrade ne me convient pas ?",
    a: "Garantie remboursement intégral sous 14 jours, sans question. Un email à contact@mindtrade.app suffit. Tu ne prends aucun risque.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" style={{ padding: "96px 5%", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Questions fréquentes</div>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 56 }}>
          Ce qu{"'"}on nous demande
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>{f.q}</div>
              <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
