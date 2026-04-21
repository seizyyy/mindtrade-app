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

const C = {
  bg: "#0f172a", card: "#1e293b", bg2: "#1e293b", bg3: "#334155",
  ink: "#f1f5f9", ink2: "#cbd5e1", ink3: "#94a3b8",
  border: "rgba(241,245,249,0.09)",
  g: "#22c55e", r: "#ef4444", a: "#f59e0b", gold: "#fbbf24",
};

function MockupAlpha() {
  const card: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px",
  };
  const label: React.CSSProperties = {
    fontSize: 9, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10,
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "absolute", top: -12, right: 16, zIndex: 3, display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 20, padding: "5px 14px", boxShadow: "0 4px 16px rgba(184,134,11,.4)" }}>
        <span style={{ fontSize: 10, color: "#fff" }}>★</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: ".06em" }}>ALPHA</span>
      </div>

      <div style={{ background: C.bg, border: "1px solid rgba(184,134,11,.2)", borderRadius: 16, padding: "14px 16px", userSelect: "none", boxShadow: "0 32px 80px rgba(0,0,0,.6)" }}>

        {/* Header */}
        <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: C.ink }}>Intelligence Alpha</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#b8860b", background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.35)", padding: "2px 8px", borderRadius: 20, letterSpacing: ".06em", textTransform: "uppercase" }}>Lifetime</span>
          </div>
          <div style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>Patterns comportementaux détectés sur tes données.</div>
        </div>

        {/* Corrélation */}
        <div style={{ ...card, marginBottom: 8 }}>
          <div style={label}>Corrélation état mental → performance</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { c: C.r, l: "État dégradé", v: "−347$", wr: "28% win" },
              { c: C.a, l: "Attention", v: "+82$", wr: "54% win" },
              { c: C.g, l: "Optimal", v: "+612$", wr: "79% win" },
            ].map(b => (
              <div key={b.l} style={{ background: C.bg2, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${b.c}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: b.c, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{b.l}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: b.c, lineHeight: 1, marginBottom: 3 }}>{b.v}</div>
                <div style={{ fontSize: 10, color: C.ink3 }}>{b.wr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Jours + Émotions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div style={card}>
            <div style={label}>Par jour de semaine</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[["Lundi", "+539$", C.g, 82], ["Mercredi", "+391$", C.g, 60], ["Vendredi", "−284$", C.r, 38]].map(([d, v, c, w]) => (
                <div key={d as string}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: C.ink3 }}>{d}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c as string }}>{v}</span>
                  </div>
                  <div style={{ height: 3, background: C.bg3, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${w}%`, background: c as string, borderRadius: 2, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={label}>Émotions en chiffres</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[["Calme", "+748$", C.g, 82], ["Confiant", "+183$", C.g, 64], ["FOMO", "−512$", C.r, 22]].map(([e, v, c, w]) => (
                <div key={e as string}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: C.ink3 }}>{e}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c as string }}>{v}</span>
                  </div>
                  <div style={{ height: 3, background: C.bg3, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${w}%`, background: c as string, borderRadius: 2, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div style={{ ...card }}>
          <div style={label}>Insights auto-générés</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { type: "pos", text: "Le Lundi est ton meilleur jour — +539$ moy. sur 8 trades (82% win)." },
              { type: "neg", text: "\"FOMO\" te coûte −512$ par trade — identifie le déclencheur." },
            ].map(({ type, text }, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "7px 10px", borderRadius: 7, background: type === "pos" ? "rgba(34,197,94,.07)" : "rgba(239,68,68,.07)", border: `1px solid ${type === "pos" ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)"}` }}>
                <span style={{ fontSize: 10, flexShrink: 0, marginTop: 1 }}>{type === "pos" ? "↑" : "⚠"}</span>
                <span style={{ fontSize: 10, color: C.ink2, lineHeight: 1.5 }}>{text}</span>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 600px", gap: 48, alignItems: "center", marginBottom: 72 }}>
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
