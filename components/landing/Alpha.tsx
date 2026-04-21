"use client";

const features = [
  {
    icon: "⚡",
    title: "Signal prédictif du jour",
    desc: "GO / CAUTION / STOP basé sur ton état mental, tes pertes récentes et tes émotions. Tu sais avant d'ouvrir un chart si tu dois trader.",
  },
  {
    icon: "🧠",
    title: "Profil trader & insights personnalisés",
    desc: "Ton style dominant, tes forces, tes biais identifiés. Un profil qui évolue avec chaque check-in et chaque trade loggé.",
  },
  {
    icon: "📈",
    title: "Corrélation état mental → performance",
    desc: "Est-ce que tu trades mieux quand tu es calme ? Quand ton score est élevé ? Les données répondent à ta place.",
  },
  {
    icon: "⚠️",
    title: "Impact discipline & émotions en chiffres",
    desc: "Combien te coûtent tes trades FOMO ? Tes journées hors règles ? Chaque mauvaise habitude a un prix — tu le vois enfin.",
  },
  {
    icon: "🎯",
    title: "Performance par paire",
    desc: "Sur quelles paires tu sur-performes, sur lesquelles tu perds systématiquement. Arrête de trader là où tu n'as pas d'edge.",
  },
  {
    icon: "📅",
    title: "Performance par jour & évolution du score",
    desc: "Tes meilleurs jours de la semaine, l'évolution de ton score mental sur 7 jours. Optimise ta routine autour de tes données.",
  },
];

export default function Alpha() {
  return (
    <section style={{ padding: "100px 5%", background: "#0a0f1e", position: "relative", overflow: "hidden" }}>
      {/* Glow background */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(184,134,11,.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,.1)", border: "1px solid rgba(184,134,11,.3)", borderRadius: 20, padding: "5px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 12 }}>★</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", letterSpacing: ".08em", textTransform: "uppercase" }}>MindTrade Alpha</span>
            <span style={{ fontSize: 11, color: "rgba(251,191,36,.5)", fontWeight: 600 }}>· Exclusif Lifetime</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px,4vw,50px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff", marginBottom: 16 }}>
            Ton tableau de bord<br />
            <em style={{ fontStyle: "italic", color: "#fbbf24" }}>comportemental</em>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Alpha va plus loin que le journal de trading. Il analyse tes patterns comportementaux sur l'ensemble de tes données et te dit exactement ce qui sabote tes performances.
          </p>
        </div>

        {/* Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 56 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 14,
              padding: "24px 22px",
              transition: "border-color .2s, background .2s",
              position: "relative",
              overflow: "hidden",
            }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,134,11,.3)";
                (e.currentTarget as HTMLElement).style.background = "rgba(184,134,11,.04)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)";
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.38)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(184,134,11,.12), rgba(184,134,11,.05))",
          border: "1px solid rgba(184,134,11,.25)",
          borderRadius: 20,
          padding: "40px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(251,191,36,.6)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Inclus dans le plan Lifetime</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>6 analyses exclusives incluses</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.4)", lineHeight: 1.6 }}>
              Débloqué dès que tu as loggé 2 trades et fait 3 check-ins.<br />
              Aucune configuration requise — tout est automatique.
            </div>
          </div>
          <a href="#acces" style={{
            flexShrink: 0,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "var(--font-outfit)",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 24px rgba(184,134,11,.35)",
          }}>
            Accès Lifetime →
          </a>
        </div>

      </div>
    </section>
  );
}
