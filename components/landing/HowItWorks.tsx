const steps = [
  {
    num: "01",
    title: "Check-in avant les charts",
    desc: "5 questions sur ton sommeil, ton stress, ta concentration, tes distractions. Moins de 2 minutes. MindTrade calcule ton score mental du jour.",
    tagBg: "rgba(15,39,68,.08)", tagColor: "var(--navy)", tag: "Avant la session",
  },
  {
    num: "02",
    title: "Score et verdict immédiat",
    desc: "Score sur 100. Verdict : Optimal / Modéré / Évite de trader. Signal mental calculé. Tu sais exactement dans quel état tu es avant de voir un chart.",
    tagBg: "rgba(22,101,52,.08)", tagColor: "var(--g)", tag: "Décision éclairée",
  },
  {
    num: "03",
    title: "Log + confluences",
    desc: "Enregistre tes trades avec l'état émotionnel. Coche tes confluences avant chaque entrée. MindTrade calcule la corrélation avec ton win rate automatiquement.",
    tagBg: "rgba(184,134,11,.1)", tagColor: "var(--gold)", tag: "Pendant la session",
  },
  {
    num: "04",
    title: "Rapport hebdo + journal",
    desc: "Rapport narratif avec les patterns détectés, les actions prioritaires pour la semaine. Journal pour documenter ta progression. Ta courbe s'améliore semaine après semaine.",
    tagBg: "rgba(155,28,28,.08)", tagColor: "var(--r)", tag: "Après la semaine",
  },
];

export default function HowItWorks() {
  return (
    <section id="fonctionnalites" style={{ padding: "96px 5%", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Comment ça marche</div>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 56 }}>
          4 étapes. 10 minutes par jour.<br />Des décisions radicalement meilleures.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              background: "var(--card)", padding: "32px 28px",
              borderRadius: i === 0 ? "12px 0 0 12px" : i === 3 ? "0 12px 12px 0" : 0,
            }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 48, fontWeight: 700, color: "var(--bg3)", lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.65 }}>{s.desc}</div>
              <span style={{ display: "inline-block", marginTop: 14, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: s.tagBg, color: s.tagColor }}>{s.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
