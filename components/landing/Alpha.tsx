"use client";

const C = {
  bg: "#0f172a", card: "#1e293b", bg2: "#1e293b", bg3: "#334155",
  ink: "#f1f5f9", ink2: "#cbd5e1", ink3: "#94a3b8",
  border: "rgba(241,245,249,0.09)",
  g: "#22c55e", r: "#ef4444", a: "#f59e0b", gold: "#fbbf24",
};

function BrowserMockup() {
  const card: React.CSSProperties = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px",
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: 9, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10,
  };

  return (
    <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)", userSelect: "none" }}>
      {/* Browser chrome */}
      <div style={{ background: "#1a2236", borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,.05)", borderRadius: 6, padding: "4px 12px", fontSize: 11, color: C.ink3, textAlign: "center" }}>
          mindtrade.co/dashboard/alpha
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.3)", borderRadius: 20, padding: "3px 10px" }}>
          <span style={{ fontSize: 9, color: C.gold }}>★</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.gold, letterSpacing: ".06em" }}>ALPHA</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ background: C.bg, padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>Intelligence Alpha</span>
              <span style={{ fontSize: 8, fontWeight: 800, color: "#b8860b", background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.3)", padding: "2px 8px", borderRadius: 20, letterSpacing: ".08em", textTransform: "uppercase" }}>Lifetime</span>
            </div>
            <div style={{ fontSize: 11, color: C.ink3 }}>Patterns comportementaux détectés sur tes données réelles.</div>
          </div>
        </div>

        {/* Corrélation — full width */}
        <div style={card}>
          <div style={sectionLabel}>Corrélation état mental → performance</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { c: C.r, l: "État dégradé", sub: "Score < 60", v: "−347$", wr: "28% win rate", bg: "rgba(239,68,68,.07)" },
              { c: C.a, l: "Attention", sub: "Score 60–74", v: "+82$", wr: "54% win rate", bg: "rgba(245,158,11,.07)" },
              { c: C.g, l: "État optimal", sub: "Score ≥ 75", v: "+612$", wr: "79% win rate", bg: "rgba(34,197,94,.07)" },
            ].map(b => (
              <div key={b.l} style={{ background: b.bg, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${b.c}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: b.c, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>{b.l}</div>
                <div style={{ fontSize: 10, color: C.ink3, marginBottom: 8 }}>{b.sub}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: b.c, lineHeight: 1, marginBottom: 3 }}>{b.v}</div>
                <div style={{ fontSize: 10, color: C.ink3 }}>moy. par trade · {b.wr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Jours + Émotions + Insights */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 10 }}>

          <div style={card}>
            <div style={sectionLabel}>Par jour de semaine</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { d: "Lundi", v: "+539$", c: C.g, w: 85 },
                { d: "Mercredi", v: "+391$", c: C.g, w: 62 },
                { d: "Jeudi", v: "+184$", c: C.g, w: 38 },
                { d: "Vendredi", v: "−284$", c: C.r, w: 45 },
              ].map(({ d, v, c, w }) => (
                <div key={d}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: C.ink3 }}>{d}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{v}</span>
                  </div>
                  <div style={{ height: 3, background: C.bg3, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${w}%`, background: c, borderRadius: 2, opacity: 0.55 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={sectionLabel}>Émotions en chiffres</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { e: "Calme", v: "+748$", c: C.g, w: 82 },
                { e: "Confiant", v: "+183$", c: C.g, w: 60 },
                { e: "Anxieux", v: "−291$", c: C.r, w: 38 },
                { e: "FOMO", v: "−512$", c: C.r, w: 22 },
              ].map(({ e, v, c, w }) => (
                <div key={e}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: C.ink3 }}>{e}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{v}</span>
                  </div>
                  <div style={{ height: 3, background: C.bg3, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${w}%`, background: c, borderRadius: 2, opacity: 0.55 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={sectionLabel}>Insights auto-générés</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { type: "pos", text: "Le Lundi est ton meilleur jour — +539$ moy. sur 8 trades (82% win)." },
                { type: "neg", text: "Évite le Vendredi — tu perds en moyenne −284$ (38% win sur 6 trades)." },
                { type: "neg", text: "\"FOMO\" te coûte −512$ par trade — identifie le déclencheur." },
              ].map(({ type, text }, i) => (
                <div key={i} style={{ display: "flex", gap: 7, padding: "7px 9px", borderRadius: 7, background: type === "pos" ? "rgba(34,197,94,.06)" : "rgba(239,68,68,.06)", border: `1px solid ${type === "pos" ? "rgba(34,197,94,.14)" : "rgba(239,68,68,.14)"}` }}>
                  <span style={{ fontSize: 9, flexShrink: 0, color: type === "pos" ? C.g : C.r, marginTop: 1, fontWeight: 700 }}>{type === "pos" ? "↑" : "⚠"}</span>
                  <span style={{ fontSize: 10, color: C.ink2, lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Alpha() {
  return (
    <section style={{ padding: "96px 5% 80px", background: "#080d1a", position: "relative", overflow: "hidden" }}>
      {/* Background grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.018) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      {/* Gold glow behind mockup */}
      <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 300, background: "radial-gradient(ellipse, rgba(184,134,11,.07) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Centered header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,134,11,.1)", border: "1px solid rgba(184,134,11,.28)", borderRadius: 20, padding: "5px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: C.gold }}>★</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: ".08em", textTransform: "uppercase" }}>MindTrade Alpha</span>
            <span style={{ fontSize: 10, color: "rgba(251,191,36,.45)", fontWeight: 600 }}>· Exclusif Lifetime</span>
          </div>

          <div style={{ fontSize: 14, color: "rgba(251,191,36,.65)", fontWeight: 600, marginBottom: 14, fontStyle: "italic" }}>
            Tu sais combien t&apos;a coûté ton dernier trade émotionnel ?
          </div>

          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(34px,4vw,54px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.02em", color: "#fff", marginBottom: 18 }}>
            Ton tableau de bord<br />
            <em style={{ fontStyle: "italic", color: C.gold }}>comportemental</em>
          </h2>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,.38)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Alpha croise ton état mental, tes émotions et tes résultats pour te dire exactement ce qui sabote tes performances — chiffres à l&apos;appui.
          </p>

          <a href="#acces" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#fff", padding: "13px 32px", borderRadius: 9, fontSize: 14,
            fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)",
            boxShadow: "0 4px 24px rgba(184,134,11,.35)",
          }}>
            Accès Lifetime → <span style={{ opacity: 0.7, fontSize: 12 }}>597€ · une fois</span>
          </a>
        </div>

        {/* Full-width browser mockup */}
        <BrowserMockup />

        {/* 3 stats below */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, marginTop: 32, background: "rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden" }}>
          {[
            { n: "2.4×", label: "plus performant quand score ≥ 75" },
            { n: "6", label: "analyses comportementales exclusives" },
            { n: "0", label: "configuration requise — tout est automatique" },
          ].map(({ n, label }) => (
            <div key={n} style={{ background: "#080d1a", padding: "20px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 32, fontWeight: 700, color: C.gold, marginBottom: 6 }}>{n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", lineHeight: 1.5 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
