const cards = [
  {
    iconBg: "rgba(155,28,28,.15)",
    iconStroke: "#f87171",
    iconPath: <><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></>,
    title: "Le journal classique",
    desc: "Tu rentres tes trades après coup. Tu notes \"FOMO\" sur le trade perdant. Tu le sais. Mais le lendemain tu recommences exactement pareil.",
    quote: "\"J'analyse mes trades depuis 2 ans. Je fais toujours les mêmes erreurs.\"",
  },
  {
    iconBg: "rgba(245,158,11,.1)",
    iconStroke: "#fbbf24",
    iconPath: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></>,
    title: "Les outils \"IA\"",
    desc: "Ils envoient ton CSV à ChatGPT et te retournent des insights génériques. Ils ne savent pas si tu as mal dormi. Ils ne voient pas ton état avant la session.",
    quote: "\"L'IA m'a dit que je fais du revenge trading. Utile. Mais comment j'arrête ?\"",
  },
  {
    iconBg: "rgba(96,165,250,.1)",
    iconStroke: "#60a5fa",
    iconPath: <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>,
    title: "Les 600 statistiques",
    desc: "Tu passes 2h à configurer des dashboards. Tu te perds dans des pivots et des charts. Tu trades moins parce que tu journalises plus. L'outil est devenu une charge.",
    quote: "\"TradesViz est puissant mais j'ai abandonné après 3 semaines. Trop complexe.\"",
  },
];

export default function Problem() {
  return (
    <section id="pourquoi" style={{ padding: "96px 5%", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Le vrai problème</div>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 20, color: "#fff", maxWidth: 600 }}>
          90% des traders perdent non pas à cause de leur stratégie — mais à cause de leur état mental.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.6)", lineHeight: 1.7, maxWidth: 560 }}>
          TradesViz te dit que tu as perdu vendredi. Edgewonk te montre que tu fais du FOMO. Toi tu le savais déjà. Le problème c{"'"}est que personne ne t{"'"}arrête <em style={{ color: "rgba(255,255,255,.6)" }}>avant</em> d{"'"}entrer.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginTop: 56 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,.04)", padding: 32,
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : 0,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="20" height="20" fill="none" stroke={c.iconStroke} strokeWidth="2" viewBox="0 0 24 24">{c.iconPath}</svg>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{c.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 1.65 }}>{c.desc}</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,.3)", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.07)" }}>{c.quote}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
