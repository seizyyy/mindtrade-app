const features = [
  {
    icon: "🧠", title: "Score mental quotidien", exclusive: true,
    desc: "Calculé avant chaque session depuis 5 indicateurs clés. Corrélé automatiquement à ton win rate sur 30 jours. Tu vois la courbe : quand tu trades bien, tu tradais avec quel score.",
    badge: "Exclusif MindTrade",
  },
  {
    icon: "⚡", title: "Signal mental", exclusive: true,
    desc: "Alerte en temps réel calculée depuis ton score + tes derniers trades. Rouge si risque de revenge trading, orange si FOMO détecté. Pas une analyse rétroactive — une alerte préventive.",
    badge: "Exclusif MindTrade",
  },
  {
    icon: "📐", title: "Score de discipline", exclusive: true,
    desc: "Distinct du score mental. Un trader peut se sentir bien et être indiscipliné — c'est souvent ce qui cause les plus grosses pertes. Ce score mesure si tu appliques tes règles indépendamment de ton état.",
    badge: "Exclusif MindTrade",
  },
  {
    icon: "✅", title: "Confluences corrélées", exclusive: false,
    desc: "Coche tes confluences avant chaque trade. MindTrade calcule automatiquement la différence de win rate entre tes trades complets et partiels. 2.1x plus de gains en moyenne.",
    badge: "Insight actionnable",
  },
  {
    icon: "📊", title: "Rapport hebdo narratif", exclusive: false,
    desc: "Pas juste des chiffres. Un résumé narratif avec les 3 patterns de la semaine, le meilleur jour vs le pire, et 3 actions concrètes pour la semaine suivante.",
    badge: "Guidance concrète",
  },
  {
    icon: "📔", title: "Journal structuré", exclusive: false,
    desc: "Bien passé / Mal passé / Biais détectés / Ce que je change demain. Simple, rapide, efficace. Avec streak d'écriture et corrélation entre jours journalisés et performance (+27% de win rate en moyenne).",
    badge: "Rituel quotidien",
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" style={{ padding: "96px 5%", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Fonctionnalités</div>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 56 }}>
          Chaque feature a une raison<br />d{"'"}exister pour ta performance
        </h2>
        <div className="landing-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: f.exclusive ? "linear-gradient(135deg,var(--card),rgba(184,134,11,.03))" : "var(--card)",
              border: f.exclusive ? "1px solid rgba(184,134,11,.3)" : "1px solid var(--border)",
              borderRadius: 12, padding: 28, transition: "all .2s", cursor: "default",
            }}
              onMouseOver={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "var(--navy)"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 32px rgba(12,12,10,.08)"; }}
              onMouseOut={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = f.exclusive ? "rgba(184,134,11,.3)" : "var(--border)"; el.style.transform = ""; el.style.boxShadow = ""; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 18 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.65 }}>{f.desc}</div>
              <span style={{
                display: "inline-block", marginTop: 12, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: f.exclusive ? "rgba(184,134,11,.1)" : "rgba(15,39,68,.07)",
                color: f.exclusive ? "var(--gold)" : "var(--navy)",
              }}>{f.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
