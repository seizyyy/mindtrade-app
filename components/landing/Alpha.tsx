"use client";

const features = [
  {
    n: "01",
    title: "Signal prédictif du jour",
    desc: "Combien de trades as-tu pris dans un mauvais état sans le savoir ? GO / CAUTION / STOP — tu sais avant d'ouvrir un chart si tu dois trader.",
  },
  {
    n: "02",
    title: "Profil trader & insights personnalisés",
    desc: "Tu répètes les mêmes erreurs sans les voir. Alpha identifie tes biais dominants et ton style réel — pas celui que tu crois avoir.",
  },
  {
    n: "03",
    title: "Corrélation état mental → performance",
    desc: "Tu te dis que tu trades bien même fatigué. Les données te prouvent le contraire — ou te confirment que tu as raison.",
  },
  {
    n: "04",
    title: "Impact discipline & émotions en chiffres",
    desc: "Vois exactement combien ton FOMO t'a coûté ce mois-ci. Chaque trade hors règles a un prix — tu le vois enfin noir sur blanc.",
  },
  {
    n: "05",
    title: "Performance par paire",
    desc: "Tu perds peut-être systématiquement sur une paire sans t'en rendre compte. Arrête de trader là où tu n'as pas d'edge.",
  },
  {
    n: "06",
    title: "Performance par jour & évolution du score",
    desc: "Tu as sûrement des jours où tu sur-trades sans résultats. Identifie-les et optimise ta routine autour de tes vraies données.",
  },
];

function MockupAlpha() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Lifetime badge */}
      <div style={{ position: "absolute", top: -12, right: 16, zIndex: 3, display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 20, padding: "5px 14px", boxShadow: "0 4px 16px rgba(184,134,11,.4)" }}>
        <span style={{ fontSize: 10, color: "#fff" }}>★</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: ".06em" }}>ALPHA</span>
      </div>

      <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(184,134,11,.2)", borderRadius: 16, padding: 18, userSelect: "none", boxShadow: "0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(184,134,11,.1)" }}>

        {/* Signal */}
        <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.18)", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 5 }}>Signal de session</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#22c55e", marginBottom: 3 }}>● État mental optimal</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>Bonne condition pour opérer aujourd&apos;hui</div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
          {[["Score", "84", "#22c55e"], ["Win Rate", "71%", "#fff"], ["P&L", "+1 847$", "#22c55e"], ["Streak", "🔥 6j", "#f59e0b"]].map(([l, v, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "10px 10px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Chart + Impact side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "12px" }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.3)", marginBottom: 10 }}>Score mental 7j</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>
              {[55, 68, 72, 60, 84, 78, 84].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${(h / 100) * 48}px`, borderRadius: 3, background: h >= 75 ? "rgba(34,197,94,.55)" : h >= 60 ? "rgba(245,158,11,.55)" : "rgba(239,68,68,.45)" }} />
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "12px" }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.3)", marginBottom: 10 }}>Impact émotions</div>
            {[["Calme", "+1 240$", "#22c55e"], ["FOMO", "−520$", "#ef4444"], ["Anxieux", "−187$", "#f59e0b"]].map(([e, p, c]) => (
              <div key={e} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{e}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance par paire */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "12px" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.3)", marginBottom: 10 }}>Performance par paire</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[["EUR/USD", 78, "+842$"], ["NAS100", 65, "+391$"], ["GBP/USD", 38, "−214$"]].map(([pair, pct, pnl]) => (
              <div key={pair as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", width: 52, flexShrink: 0 }}>{pair}</span>
                <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: (pct as number) >= 60 ? "rgba(34,197,94,.6)" : "rgba(239,68,68,.5)" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: (pct as number) >= 60 ? "#22c55e" : "#ef4444", width: 42, textAlign: "right", flexShrink: 0 }}>{pnl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Alpha() {
  return (
    <section style={{ padding: "100px 5%", background: "#080d1a", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.022) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", left: "30%", width: 500, height: 400, background: "radial-gradient(ellipse, rgba(184,134,11,.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Header left + mockup right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 460px", gap: 56, alignItems: "center", marginBottom: 72 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,.1)", border: "1px solid rgba(184,134,11,.28)", borderRadius: 20, padding: "5px 16px", marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: "#fbbf24" }}>★</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: ".08em", textTransform: "uppercase" }}>MindTrade Alpha</span>
              <span style={{ fontSize: 10, color: "rgba(251,191,36,.45)", fontWeight: 600 }}>· Exclusif Lifetime</span>
            </div>

            {/* Hook question */}
            <div style={{ fontSize: 15, color: "rgba(251,191,36,.7)", fontWeight: 600, marginBottom: 16, fontStyle: "italic" }}>
              Tu sais combien t&apos;a coûté ton dernier trade émotionnel ?
            </div>

            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,3.5vw,50px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff", marginBottom: 20 }}>
              Ton tableau de bord<br />
              <em style={{ fontStyle: "italic", color: "#fbbf24" }}>comportemental</em>
            </h2>

            <p style={{ fontSize: 15, color: "rgba(255,255,255,.38)", lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              Alpha croise ton état mental, tes émotions et tes résultats pour te dire exactement ce qui sabote tes performances — chiffres à l&apos;appui.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <a href="#acces" style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff", padding: "13px 28px", borderRadius: 9, fontSize: 14,
                fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)",
                boxShadow: "0 4px 24px rgba(184,134,11,.3)",
              }}>
                Accès Lifetime →
              </a>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.25)" }}>597€ · une fois · à vie</span>
            </div>
          </div>

          <MockupAlpha />
        </div>

        {/* Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 40 }}>
          {features.map((f) => (
            <div key={f.n} style={{
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: 12,
              padding: "22px 20px",
              transition: "border-color .2s, background .2s",
              cursor: "default",
            }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,134,11,.28)";
                (e.currentTarget as HTMLElement).style.background = "rgba(184,134,11,.035)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.025)";
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(251,191,36,.35)", letterSpacing: ".1em", marginBottom: 10 }}>{f.n}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 7, lineHeight: 1.35 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.32)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Second CTA after cards */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <a href="#acces" style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#fff", padding: "14px 36px", borderRadius: 9, fontSize: 15,
            fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)",
            boxShadow: "0 4px 24px rgba(184,134,11,.3)",
          }}>
            Obtenir l&apos;accès Alpha →
          </a>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.2)" }}>Inclus dans le Lifetime · 597€ une fois · Débloqué automatiquement</span>
        </div>

      </div>
    </section>
  );
}
