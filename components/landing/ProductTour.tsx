"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { id: "checkin",   duration: 3200 },
  { id: "score",     duration: 3000 },
  { id: "dashboard", duration: 3500 },
  { id: "trades",    duration: 3000 },
  { id: "rapport",   duration: 3200 },
];

function CheckinScreen({ progress }: { progress: number }) {
  const questions = [
    { q: "Comment as-tu dormi cette nuit ?", val: 4 },
    { q: "Quel est ton niveau de stress ?", val: 2 },
    { q: "Ta concentration est-elle bonne ?", val: 5 },
  ];
  const visible = progress > 0.15 ? (progress > 0.45 ? (progress > 0.72 ? 3 : 2) : 1) : 0;
  return (
    <div style={{ padding: "28px 32px", height: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>Check-in mental</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Comment vas-tu aujourd'hui ?</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ opacity: i < visible ? 1 : 0, transform: i < visible ? "translateY(0)" : "translateY(12px)", transition: "all .5s ease", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 12 }}>{q.q}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3,4,5].map(n => (
                <div key={n} style={{ flex: 1, height: 36, borderRadius: 8, background: n <= q.val ? "rgba(59,130,246,.35)" : "rgba(255,255,255,.05)", border: `1px solid ${n <= q.val ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: n <= q.val ? "#93c5fd" : "rgba(255,255,255,.2)", transition: "all .3s" }}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ opacity: visible >= 3 ? 1 : 0, transition: "opacity .5s .2s", background: "#3b82f6", borderRadius: 10, padding: "13px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
        Calculer mon score →
      </div>
    </div>
  );
}

function ScoreScreen({ progress }: { progress: number }) {
  const score = Math.round(progress * 82);
  const show = progress > 0.25;
  return (
    <div style={{ padding: "28px 32px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 14 }}>Ton score mental du jour</div>
        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 80, fontWeight: 700, color: score >= 75 ? "#4ade80" : score >= 60 ? "#fb923c" : "#f87171", lineHeight: 1, transition: "color .3s" }}>
          {score}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 6 }}>/100</div>
      </div>
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(10px)", transition: "all .6s ease", display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 20, padding: "8px 20px" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>État optimal · Tu peux trader</span>
      </div>
      <div style={{ opacity: show ? 1 : 0, transition: "opacity .6s .3s", maxWidth: 340, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,.35)", lineHeight: 1.6 }}>
        Ton état mental est excellent. Respecte ton plan de trading et exploite les setups de qualité.
      </div>
      <div style={{ display: "flex", gap: 10, opacity: show ? 1 : 0, transition: "opacity .6s .5s" }}>
        {[
          { label: "Sommeil", val: "4/5", color: "#4ade80" },
          { label: "Stress", val: "2/5", color: "#4ade80" },
          { label: "Focus", val: "5/5", color: "#4ade80" },
        ].map(m => (
          <div key={m.label} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardScreen({ progress }: { progress: number }) {
  const showSignal = progress > 0.3;
  const showTrades = progress > 0.55;
  const showStats = progress > 0.75;
  return (
    <div style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Signal */}
      <div style={{ opacity: showSignal ? 1 : 0, transform: showSignal ? "translateY(0)" : "translateY(8px)", transition: "all .5s ease", background: "linear-gradient(135deg, rgba(15,39,68,.9) 0%, rgba(26,58,92,.7) 100%)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>Signal de session</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Conditions optimales</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 20, padding: "3px 10px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#4ade80" }}>Tu peux trader</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[{ label: "Score", val: "82", color: "#4ade80" }, { label: "Streak", val: "14j", color: "#93c5fd" }, { label: "Win rate", val: "68%", color: "#4ade80" }].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
        {/* Derniers trades */}
        <div style={{ opacity: showTrades ? 1 : 0, transform: showTrades ? "translateY(0)" : "translateY(8px)", transition: "all .5s ease", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Derniers trades</div>
          {[
            { pair: "EUR/USD", pnl: "+85€", win: true },
            { pair: "GBP/JPY", pnl: "+140€", win: true },
            { pair: "NAS100",  pnl: "−60€",  win: false },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.win ? "#4ade80" : "#f87171", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)", flex: 1 }}>{t.pair}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: t.win ? "#4ade80" : "#f87171" }}>{t.pnl}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ opacity: showStats ? 1 : 0, transform: showStats ? "translateY(0)" : "translateY(8px)", transition: "all .5s ease", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Cette semaine</div>
          {[
            { label: "P&L net", val: "+620€", color: "#4ade80" },
            { label: "Win rate", val: "68%",   color: "#4ade80" },
            { label: "Trades",  val: "9",       color: "rgba(255,255,255,.7)" },
            { label: "Streak",  val: "14j 🔥",  color: "#93c5fd" },
          ].map(m => (
            <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TradesScreen({ progress }: { progress: number }) {
  const rows = [
    { pair: "EUR/USD", dir: "Long",  res: "Gagnant",   pnl: "+85€",  score: 82 },
    { pair: "GBP/JPY", dir: "Long",  res: "Gagnant",   pnl: "+140€", score: 78 },
    { pair: "NAS100",  dir: "Short", res: "Perdant",    pnl: "−60€",  score: 55 },
    { pair: "BTC/USD", dir: "Long",  res: "Breakeven",  pnl: "0€",    score: 70 },
  ];
  const visible = Math.floor(progress * (rows.length + 1));
  return (
    <div style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>Log de trades</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Historique · Avril 2026</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 0, borderBottom: "1px solid rgba(255,255,255,.06)", paddingBottom: 8, marginBottom: 4 }}>
        {["Paire", "Direction", "Résultat", "P&L", "Score mental"].map(h => (
          <div key={h} style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>{h}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ opacity: i < visible ? 1 : 0, transform: i < visible ? "translateX(0)" : "translateX(-12px)", transition: "all .4s ease", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", alignItems: "center", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.pair}</span>
            <span style={{ fontSize: 12, color: r.dir === "Long" ? "#4ade80" : "#f87171", fontWeight: 600 }}>{r.dir}</span>
            <span style={{ fontSize: 12, color: r.res === "Gagnant" ? "#4ade80" : r.res === "Perdant" ? "#f87171" : "rgba(255,255,255,.5)", fontWeight: 600 }}>{r.res}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: r.pnl.startsWith("+") ? "#4ade80" : r.pnl.startsWith("−") ? "#f87171" : "rgba(255,255,255,.5)" }}>{r.pnl}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ height: 3, flex: 1, background: "rgba(255,255,255,.08)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${r.score}%`, background: r.score >= 75 ? "#4ade80" : r.score >= 60 ? "#fb923c" : "#f87171", borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", flexShrink: 0 }}>{r.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RapportScreen({ progress }: { progress: number }) {
  const showBars = progress > 0.2;
  const showInsights = progress > 0.55;
  const bars = [
    { day: "Lun", pnl: 85,  score: 82, win: true  },
    { day: "Mar", pnl: 140, score: 78, win: true  },
    { day: "Mer", pnl: -60, score: 55, win: false },
    { day: "Jeu", pnl: 220, score: 88, win: true  },
    { day: "Ven", pnl: 60,  score: 74, win: true  },
  ];
  const maxAbs = 220;
  return (
    <div style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>Rapport hebdomadaire</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Semaine du 14 avril</div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "#4ade80" }}>+445€</div>
        </div>
      </div>

      {/* Barres */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 90 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: 70, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{
                width: "100%",
                height: showBars ? `${(Math.abs(b.pnl) / maxAbs) * 70}px` : "0px",
                background: b.win ? "rgba(74,222,128,.35)" : "rgba(248,113,113,.35)",
                border: `1px solid ${b.win ? "rgba(74,222,128,.4)" : "rgba(248,113,113,.4)"}`,
                borderRadius: 6,
                transition: `height .6s ease ${i * 0.1}s`,
              }} />
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", fontWeight: 600 }}>{b.day}</div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {[
          { icon: "📈", text: "Tes meilleures sessions coïncident avec un score mental ≥ 78.", color: "rgba(74,222,128,.15)", border: "rgba(74,222,128,.25)" },
          { icon: "⚠️", text: "Mercredi (score 55) : −60€. Évite de trader sous 60.", color: "rgba(248,113,113,.1)", border: "rgba(248,113,113,.2)" },
        ].map((ins, i) => (
          <div key={i} style={{ opacity: showInsights ? 1 : 0, transform: showInsights ? "translateY(0)" : "translateY(8px)", transition: `all .5s ease ${i * 0.2}s`, background: ins.color, border: `1px solid ${ins.border}`, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{ins.icon}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LABELS: Record<string, string> = {
  checkin: "Check-in mental",
  score: "Score du jour",
  dashboard: "Vue d'ensemble",
  trades: "Log de trades",
  rapport: "Rapport hebdo",
};

export default function ProductTour() {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let startTime: number | null = null;
    let raf: number;

    function tick(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const dur = STEPS[stepIdx].duration;
      const p = Math.min(elapsed / dur, 1);
      setProgress(p);

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTransitioning(true);
        setTimeout(() => {
          setStepIdx(i => (i + 1) % STEPS.length);
          setProgress(0);
          setTransitioning(false);
        }, 400);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stepIdx]);

  const step = STEPS[stepIdx];

  return (
    <section style={{ padding: "120px 5%", background: "#0a0f1a", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(ellipse, rgba(15,39,68,.7) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 14 }}>Le produit</div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,54px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.025em", color: "#fff", marginBottom: 16 }}>
            Ton copilote mental.<br />
            <span style={{ color: "rgba(255,255,255,.35)" }}>Ouvert avant chaque session.</span>
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.4)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Un dashboard conçu pour te rendre plus discipliné — pas plus occupé.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setStepIdx(i); setProgress(0); }}
              style={{
                background: stepIdx === i ? "rgba(59,130,246,.2)" : "rgba(255,255,255,.04)",
                border: `1px solid ${stepIdx === i ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.08)"}`,
                borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600,
                color: stepIdx === i ? "#93c5fd" : "rgba(255,255,255,.35)",
                cursor: "pointer", transition: "all .2s",
              }}
            >
              {LABELS[s.id]}
            </button>
          ))}
        </div>

        {/* Fenêtre principale */}
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.04), 0 40px 120px rgba(0,0,0,.7)",
          background: "#0d1424",
        }}>
          {/* Topbar */}
          <div style={{ height: 44, background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,.9)", letterSpacing: "-.3px" }}>MindTrade</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.25)", fontWeight: 600 }}>{LABELS[step.id]}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["#f87171","#fbbf24","#4ade80"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .4 }} />)}
            </div>
          </div>

          {/* Contenu animé */}
          <div style={{ height: 340, opacity: transitioning ? 0 : 1, transition: "opacity .35s ease", overflow: "hidden" }}>
            {step.id === "checkin"   && <CheckinScreen   progress={progress} />}
            {step.id === "score"     && <ScoreScreen     progress={progress} />}
            {step.id === "dashboard" && <DashboardScreen progress={progress} />}
            {step.id === "trades"    && <TradesScreen    progress={progress} />}
            {step.id === "rapport"   && <RapportScreen   progress={progress} />}
          </div>

          {/* Barre de progression */}
          <div style={{ height: 3, background: "rgba(255,255,255,.06)" }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 2, transition: "width .1s linear" }} />
          </div>
        </div>

        {/* Légende */}
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
    </section>
  );
}
