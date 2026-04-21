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
    <div style={{ position: "relative", width: "100%", maxWidth: 380 }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        backdropFilter: "blur(6px)",
        background: "rgba(10,15,30,.45)",
        borderRadius: 14,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(184,134,11,.15)", border: "1px solid rgba(184,134,11,.4)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>★</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", textAlign: "center" }}>Exclusif Lifetime</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", textAlign: "center", maxWidth: 200, lineHeight: 1.5 }}>
          Débloqué après 3 check-ins et 2 trades loggés
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: 16, userSelect: "none" }}>
        <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Signal de session</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>● État mental optimal</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 2 }}>Conditions favorables au trading</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[["Score mental", "84"], ["Win Rate", "71%"], ["P&L net", "+1 847$"]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", marginBottom: 8 }}>Score mental 7 jours</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 40 }}>
            {[55, 68, 72, 60, 84, 78, 84].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${(h / 100) * 40}px`, borderRadius: 3, background: h >= 75 ? "rgba(34,197,94,.5)" : h >= 60 ? "rgba(245,158,11,.5)" : "rgba(239,68,68,.4)" }} />
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", marginBottom: 8 }}>Impact émotionnel</div>
          {[["Calme", "+1 240$", "#22c55e"], ["FOMO", "−520$", "#ef4444"], ["Anxieux", "−187$", "#f59e0b"]].map(([e, p, c]) => (
            <div key={e} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{e}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{p}</span>
            </div>
          ))}
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 64, alignItems: "center", marginBottom: 72 }}>
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
