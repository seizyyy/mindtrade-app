export default function ProductTour() {
  return (
    <section style={{
      padding: "120px 5%",
      background: "#0a0f1a",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow de fond */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(15,39,68,.6) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(184,134,11,.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 14 }}>Le produit</div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,54px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.025em", color: "#fff", marginBottom: 16 }}>
            Ton copilote mental.<br />
            <span style={{ color: "rgba(255,255,255,.35)" }}>Ouvert avant chaque session.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.4)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Un dashboard conçu pour te rendre plus discipliné — pas plus occupé.
          </p>
        </div>

        {/* Dashboard principal */}
        <div style={{ position: "relative" }}>

          {/* Cartes flottantes — gauche */}
          <div style={{ position: "absolute", left: -20, top: "15%", zIndex: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
              width: 168,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Score mental</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 36, fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>82</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 4 }}>État optimal · +8 pts</div>
              <div style={{ height: 3, background: "rgba(255,255,255,.08)", borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: "100%", width: "82%", background: "#4ade80", borderRadius: 2 }} />
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
              width: 168,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Streak check-ins</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 6 }}>
                {["ok","ok","ok","miss","ok","ok","now"].map((s, i) => (
                  <div key={i} style={{ aspectRatio: "1", borderRadius: 3, background: s === "ok" ? "rgba(74,222,128,.35)" : s === "now" ? "#4ade80" : "rgba(255,255,255,.07)" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>12 jours consécutifs</div>
            </div>
          </div>

          {/* Cartes flottantes — droite */}
          <div style={{ position: "absolute", right: -20, top: "10%", zIndex: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
              width: 168,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Cette semaine</div>
              {[
                { label: "Win rate", val: "68%", color: "#4ade80" },
                { label: "P&L net", val: "+620€", color: "#4ade80" },
                { label: "Trades", val: "9", color: "rgba(255,255,255,.7)" },
              ].map(m => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{m.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.val}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: "rgba(155,28,28,.12)",
              border: "1px solid rgba(155,28,28,.25)",
              borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
              width: 168,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(251,191,36,.7)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>⚠ Biais détecté</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fca5a5", marginBottom: 4 }}>Risque FOMO</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", lineHeight: 1.5 }}>Score bas après 2 pertes. Analyse avant d{"'"}entrer.</div>
            </div>
          </div>

          {/* Dashboard central */}
          <div style={{
            margin: "0 160px",
            background: "linear-gradient(180deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(255,255,255,.04), 0 40px 120px rgba(0,0,0,.6)",
          }}>
            {/* Topbar */}
            <div style={{ height: 44, background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,.9)", letterSpacing: "-.3px" }}>MindTrade</span>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>Mercredi 2 avril 2026</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.6)" }}>TM</div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              {/* Sidebar */}
              <div style={{ width: 52, background: "rgba(255,255,255,.02)", borderRight: "1px solid rgba(255,255,255,.05)", padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                {[
                  { icon: "⊞", active: true },
                  { icon: "◎", active: false },
                  { icon: "✎", active: false },
                  { icon: "▦", active: false },
                  { icon: "📖", active: false },
                ].map((item, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: item.active ? "rgba(255,255,255,.1)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, opacity: item.active ? 1 : 0.3, cursor: "pointer" }}>
                    {item.icon}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div style={{ flex: 1, padding: "20px 20px" }}>
                {/* Hero score */}
                <div style={{ background: "linear-gradient(135deg, rgba(15,39,68,.8) 0%, rgba(26,58,92,.6) 100%)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "20px 24px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>Score mental · aujourd{"'"}hui</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 52, fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>82</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,.3)" }}>/100</span>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 20, padding: "4px 12px" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80" }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#4ade80" }}>État optimal · Tu peux trader</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      { label: "Win rate", val: "68%", color: "#4ade80" },
                      { label: "P&L net", val: "+620€", color: "#4ade80" },
                      { label: "Streak", val: "14j", color: "#93c5fd" },
                    ].map(m => (
                      <div key={m.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 3 }}>{m.label}</div>
                        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, color: m.color }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2 cols */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {/* Règles */}
                  <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Objectifs du jour</div>
                    {[
                      { txt: "Respecter mes stops", done: true },
                      { txt: "Max 3 trades / session", done: true },
                      { txt: "Stop après 2 pertes", done: false },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: r.done ? "#4ade80" : "transparent", border: r.done ? "none" : "1px solid rgba(255,255,255,.15)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#0a0f1a", fontWeight: 900 }}>
                          {r.done ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: 11, color: r.done ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.65)", textDecoration: r.done ? "line-through" : "none" }}>{r.txt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Derniers trades */}
                  <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Derniers trades</div>
                    {[
                      { pair: "EUR/USD", pnl: "+85€", win: true },
                      { pair: "GBP/JPY", pnl: "+140€", win: true },
                      { pair: "NAS100", pnl: "−60€", win: false },
                    ].map((t, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.win ? "#4ade80" : "#f87171", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.7)", flex: 1 }}>{t.pair}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.win ? "#4ade80" : "#f87171" }}>{t.pnl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Légende annotations */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { dot: "#4ade80", label: "Score mental calculé automatiquement" },
              { dot: "#fbbf24", label: "Biais détectés en temps réel" },
              { dot: "#93c5fd", label: "Performance corrélée à l'état mental" },
            ].map(a => (
              <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,.35)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
