"use client";

const C = {
  bg: "#0f172a", card: "#1e293b", bg2: "#1e293b", bg3: "#334155",
  ink: "#f1f5f9", ink2: "#cbd5e1", ink3: "#94a3b8",
  border: "rgba(241,245,249,0.09)",
  g: "#22c55e", r: "#ef4444", a: "#f59e0b", gold: "#fbbf24",
};

function DashboardPreview() {
  const card: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px",
  };
  const label: React.CSSProperties = {
    fontSize: 8, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8,
  };

  return (
    <div style={{ background: C.bg, padding: "14px", display: "flex", flexDirection: "column", gap: 8, filter: "contrast(0.85) brightness(0.97)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>Intelligence Alpha</span>
            <span style={{ fontSize: 7, fontWeight: 800, color: "#b8860b", background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.3)", padding: "2px 7px", borderRadius: 20, letterSpacing: ".08em", textTransform: "uppercase" }}>Lifetime</span>
          </div>
          <div style={{ fontSize: 10, color: C.ink3, marginTop: 2 }}>Patterns comportementaux sur tes données réelles.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ v: "+2 847$", l: "Ce mois", c: C.g }, { v: "73%", l: "Win rate", c: C.g }, { v: "4.2", l: "Score moy.", c: C.a }].map(s => (
            <div key={s.l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.c, fontFamily: "Georgia, serif" }}>{s.v}</div>
              <div style={{ fontSize: 8, color: C.ink3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corrélation — 3 buckets */}
      <div style={card}>
        <div style={label}>Corrélation état mental → performance</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { c: C.r, l: "État dégradé", sub: "Score < 60", v: "−347$", wr: "28% win", bg: "rgba(239,68,68,.07)" },
            { c: C.a, l: "Attention", sub: "Score 60–74", v: "+82$", wr: "54% win", bg: "rgba(245,158,11,.07)" },
            { c: C.g, l: "État optimal", sub: "Score ≥ 75", v: "+612$", wr: "79% win", bg: "rgba(34,197,94,.07)" },
          ].map(b => (
            <div key={b.l} style={{ background: b.bg, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${b.c}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: b.c, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 1 }}>{b.l}</div>
              <div style={{ fontSize: 9, color: C.ink3, marginBottom: 6 }}>{b.sub}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: b.c, lineHeight: 1, marginBottom: 2 }}>{b.v}</div>
              <div style={{ fontSize: 9, color: C.ink3 }}>moy. · {b.wr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Jours + Émotions + Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 8 }}>
        <div style={card}>
          <div style={label}>Par jour de semaine</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { d: "Lundi", v: "+539$", c: C.g, w: 85 },
              { d: "Mercredi", v: "+391$", c: C.g, w: 62 },
              { d: "Jeudi", v: "+184$", c: C.g, w: 38 },
              { d: "Vendredi", v: "−284$", c: C.r, w: 45 },
            ].map(({ d, v, c, w }) => (
              <div key={d}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: C.ink3 }}>{d}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: c }}>{v}</span>
                </div>
                <div style={{ height: 2, background: C.bg3, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${w}%`, background: c, borderRadius: 2, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={label}>Émotions en chiffres</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { e: "Calme", v: "+748$", c: C.g, w: 82 },
              { e: "Confiant", v: "+183$", c: C.g, w: 60 },
              { e: "Anxieux", v: "−291$", c: C.r, w: 38 },
              { e: "FOMO", v: "−512$", c: C.r, w: 22 },
            ].map(({ e, v, c, w }) => (
              <div key={e}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: C.ink3 }}>{e}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: c }}>{v}</span>
                </div>
                <div style={{ height: 2, background: C.bg3, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${w}%`, background: c, borderRadius: 2, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={label}>Insights auto-générés</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { type: "pos", text: "Le Lundi est ton meilleur jour — +539$ moy. sur 8 trades (82% win)." },
              { type: "neg", text: "Évite le Vendredi — tu perds en moyenne −284$ (38% win)." },
              { type: "neg", text: "\"FOMO\" te coûte −512$ par trade. Identifie le déclencheur." },
            ].map(({ type, text }, i) => (
              <div key={i} style={{ display: "flex", gap: 6, padding: "6px 8px", borderRadius: 6, background: type === "pos" ? "rgba(34,197,94,.06)" : "rgba(239,68,68,.06)", border: `1px solid ${type === "pos" ? "rgba(34,197,94,.14)" : "rgba(239,68,68,.14)"}` }}>
                <span style={{ fontSize: 8, flexShrink: 0, color: type === "pos" ? C.g : C.r, marginTop: 1, fontWeight: 700 }}>{type === "pos" ? "↑" : "⚠"}</span>
                <span style={{ fontSize: 9, color: C.ink2, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserMockup() {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)" }}>
      {/* Chrome */}
      <div style={{ background: "#161f33", borderBottom: `1px solid ${C.border}`, padding: "9px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,.05)", borderRadius: 5, padding: "3px 10px", fontSize: 10, color: C.ink3, textAlign: "center" }}>
          mindtrade.co/dashboard/alpha
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.28)", borderRadius: 20, padding: "2px 9px" }}>
          <span style={{ fontSize: 8, color: C.gold }}>★</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: C.gold, letterSpacing: ".06em" }}>ALPHA</span>
        </div>
      </div>
      <DashboardPreview />
    </div>
  );
}

export default function Alpha() {
  return (
    <section style={{ padding: "96px 5% 80px", background: "#080d1a", position: "relative", overflow: "hidden" }}>
      {/* BG grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.016) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      {/* Ambient gold */}
      <div style={{ position: "absolute", bottom: "5%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(184,134,11,.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,.1)", border: "1px solid rgba(184,134,11,.25)", borderRadius: 20, padding: "5px 16px", marginBottom: 18 }}>
            <span style={{ fontSize: 10, color: C.gold }}>★</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: ".08em", textTransform: "uppercase" }}>MindTrade Alpha</span>
            <span style={{ fontSize: 10, color: "rgba(251,191,36,.45)", fontWeight: 600 }}>· Exclusif Lifetime</span>
          </div>

          <div style={{ fontSize: 13, color: "rgba(251,191,36,.6)", fontWeight: 600, marginBottom: 14, fontStyle: "italic" }}>
            Tu sais combien t&apos;a coûté ton dernier trade émotionnel ?
          </div>

          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.02em", color: "#fff", marginBottom: 16 }}>
            Ton tableau de bord<br />
            <em style={{ fontStyle: "italic", color: C.gold }}>comportemental</em>
          </h2>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,.36)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Alpha croise ton état mental, tes émotions et tes résultats — et te dit exactement ce qui sabote tes performances.
          </p>
        </div>

        {/* Mockup + fade overlay container */}
        <div style={{ position: "relative" }}>
          <BrowserMockup />

          {/* Gradient fade — bottom 45% */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "52%",
            background: "linear-gradient(to bottom, transparent 0%, rgba(8,13,26,.6) 30%, rgba(8,13,26,.92) 60%, #080d1a 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
            paddingBottom: 36,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,.1)", border: "1px solid rgba(184,134,11,.3)", borderRadius: 20, padding: "5px 16px", marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: C.gold }}>★</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: ".06em", textTransform: "uppercase" }}>Réservé aux membres Lifetime</span>
              </div>
              <div style={{ marginBottom: 20 }}>
                <a href="#acces" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#fff", padding: "12px 28px", borderRadius: 8, fontSize: 14,
                  fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)",
                  boxShadow: "0 4px 24px rgba(184,134,11,.4)",
                }}>
                  Accès Lifetime · 597€ une fois →
                </a>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>
                Paiement unique · Toutes les futures fonctionnalités incluses à vie
              </div>
            </div>
          </div>
        </div>

        {/* 6 analyses Alpha */}
        <div style={{ marginTop: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".12em" }}>Ce qu&apos;Alpha analyse pour toi</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { n: "01", title: "Corrélation mental → P&L", desc: "Score < 60, 60–74, ≥ 75 : vois exactement ce que ton état prédit sur tes trades." },
              { n: "02", title: "Performance par jour", desc: "Lundi vs Vendredi — identifie tes meilleurs et pires jours selon tes données réelles." },
              { n: "03", title: "Émotions en chiffres", desc: "Calme, FOMO, Confiant… chaque état a un P&L moyen chiffré sur ton historique." },
              { n: "04", title: "Impact discipline", desc: "Ce que respecter tes règles te rapporte concrètement par trade — au dollar près." },
              { n: "05", title: "Performance par paire", desc: "Tes meilleures et pires paires selon ton historique réel. Exclure la mauvaise change tout." },
              { n: "06", title: "Insights auto-générés", desc: "Recommandations personnalisées détectées depuis tes patterns comportementaux réels." },
            ].map(({ n, title, desc }) => (
              <div key={title} style={{
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 10, padding: "22px 24px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(251,191,36,.5)", letterSpacing: ".08em", marginBottom: 12 }}>{n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
