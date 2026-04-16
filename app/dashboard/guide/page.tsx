"use client";

const sections = [
  {
    id: "checkin",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>
      </svg>
    ),
    color: "var(--navy)",
    tintBg: "var(--tint-n-bg)",
    tintBorder: "var(--tint-n-border)",
    title: "Check-in mental",
    subtitle: "À faire chaque matin avant d'ouvrir tes charts",
    steps: [
      { label: "Réponds aux questions", desc: "6 questions sur ton état émotionnel, ton sommeil, ton stress et ta concentration. Sois honnête — personne d'autre ne voit tes réponses." },
      { label: "Reçois ton score (0–100)", desc: "MindTrade calcule ton état mental du jour. ≥75 = optimal, 60–74 = attention, <60 = évite de trader." },
      { label: "Lis le signal de session", desc: "En fonction de ton score, tu reçois une recommandation concrète : trade normal, réduis ton risque, ou pause totale." },
    ],
    tip: "Le check-in n'est pas optionnel. Les traders qui sautent cette étape prennent 2× plus de trades impulsifs.",
  },
  {
    id: "trades",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    color: "var(--g)",
    tintBg: "var(--tint-g-bg)",
    tintBorder: "var(--tint-g-border)",
    title: "Log de trades",
    subtitle: "Enregistre chaque trade dès qu'il est clôturé",
    steps: [
      { label: "Remplis les champs clés", desc: "Paire, direction (Long/Short), résultat (Gagnant/Perdant/Breakeven), P&L en %, et une note optionnelle sur ton état d'esprit." },
      { label: "Ajoute une note honnête", desc: "Décris pourquoi tu as pris ce trade, si tu as respecté ton plan, et ce que tu ressens après. C'est là que la vraie progression se construit." },
      { label: "Consulte tes statistiques", desc: "Win rate, P&L moyen, pertes consécutives — toutes les métriques se calculent automatiquement au fil de tes entrées." },
    ],
    tip: "Logge même les trades que tu regrettes. Les mauvais trades bien analysés sont plus précieux que les bons trades ignorés.",
  },
  {
    id: "rapport",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    color: "var(--a)",
    tintBg: "var(--tint-a-bg)",
    tintBorder: "var(--tint-a-border)",
    title: "Rapport hebdomadaire",
    subtitle: "Analyse ta semaine chaque dimanche",
    steps: [
      { label: "Vois ta progression sur 7 jours", desc: "P&L total, win rate, score mental moyen, jours tradés vs reposés. Une vue synthétique de ta semaine en un coup d'œil." },
      { label: "Identifie tes patterns", desc: "MindTrade détecte automatiquement tes jours les plus rentables, tes paires les plus performantes, et les corrélations entre ton état mental et tes résultats." },
      { label: "Lis les insights personnalisés", desc: "3 à 5 observations générées à partir de tes propres données — pas de conseils génériques, juste ton trading analysé." },
    ],
    tip: "Compare ton P&L selon ton score mental. La plupart des traders découvrent qu'ils perdent de l'argent quand leur score est sous 65.",
  },
  {
    id: "journal",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    color: "var(--navy)",
    tintBg: "var(--tint-n-bg)",
    tintBorder: "var(--tint-n-border)",
    title: "Journal",
    subtitle: "Tes réflexions libres, privées et indexées",
    steps: [
      { label: "Écris librement", desc: "Pas de format imposé. Parle de ta séance, d'une erreur, d'une victoire, d'une prise de conscience. Le journal n'est pas un rapport — c'est un espace de pensée." },
      { label: "Relis tes entrées passées", desc: "Retrouve des patterns dans ta façon de penser. Souvent, les erreurs récurrentes se voient dans le journal bien avant qu'elles apparaissent dans les stats." },
    ],
    tip: "3 lignes après chaque séance suffisent. La régularité compte plus que la longueur.",
  },
  {
    id: "confluences",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    color: "var(--g)",
    tintBg: "var(--tint-g-bg)",
    tintBorder: "var(--tint-g-border)",
    title: "Confluences",
    subtitle: "Valide ton setup avant d'entrer en position",
    steps: [
      { label: "Coche tes critères d'entrée", desc: "Structure de marché, zone de valeur, momentum, catalyseur. Chaque critère validé augmente ton score de confluence." },
      { label: "Lis le verdict", desc: "Setup solide, partiel, ou invalide — le score te donne une réponse claire avant que l'émotion ne décide à ta place." },
      { label: "Ne trade que si le score est suffisant", desc: "Un setup à 40% n'est pas un trade. C'est une intuition. Attends la confirmation ou passe à autre chose." },
    ],
    tip: "Utilise cet outil avant chaque entrée, pas après. L'objectif est de te forcer à rationaliser avant d'agir.",
  },
];

export default function GuidePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 8 }}>Guide</div>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>Comment utiliser MindTrade</h1>
        <p style={{ fontSize: 14, color: "var(--ink3)", marginTop: 10, lineHeight: 1.6 }}>
          MindTrade est un outil de discipline mentale pour traders. Chaque fonctionnalité a un rôle précis dans ta routine. Voici comment en tirer le maximum.
        </p>
      </div>

      {/* Workflow rapide */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>Routine recommandée</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: "1", time: "Avant les marchés", action: "Fais ton check-in mental", href: "/dashboard/checkin", color: "var(--navy)" },
            { step: "2", time: "Avant chaque trade", action: "Vérifie tes confluences", href: "/dashboard/confluences", color: "var(--g)" },
            { step: "3", time: "Après chaque trade", action: "Logge dans le journal de trades", href: "/dashboard/trades", color: "var(--g)" },
            { step: "4", time: "En fin de séance", action: "Écris une note dans le journal", href: "/dashboard/journal", color: "var(--navy)" },
            { step: "5", time: "Chaque dimanche", action: "Analyse ton rapport hebdo", href: "/dashboard/rapport", color: "var(--a)" },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--bg2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--ink3)", flexShrink: 0 }}>{r.step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 2 }}>{r.time}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{r.action}</div>
              </div>
              <a href={r.href} style={{ fontSize: 12, fontWeight: 700, color: r.color, textDecoration: "none", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", flexShrink: 0 }}>
                Ouvrir →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Sections détaillées */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s) => (
          <div key={s.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {/* Header section */}
            <div style={{ padding: "18px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.tintBg, border: `1px solid ${s.tintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>{s.subtitle}</div>
              </div>
            </div>

            {/* Steps */}
            <div style={{ padding: "16px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {s.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.tintBg, border: `1px solid ${s.tintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: s.color, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{step.label}</div>
                      <div style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.55 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div style={{ marginTop: 16, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.55 }}>{s.tip}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ marginTop: 28, background: "var(--tint-n-bg)", border: "1px solid var(--tint-n-border)", borderRadius: 14, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Prêt à commencer ?</div>
        <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Commence par ton check-in du jour. Toutes les analyses se débloquent au fur et à mesure.</div>
        <a href="/dashboard/checkin" style={{ display: "inline-block", background: "var(--navy)", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Faire mon check-in →
        </a>
      </div>

    </div>
  );
}
