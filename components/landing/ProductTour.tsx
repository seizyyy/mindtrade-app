"use client";

import { useEffect, useState, useRef } from "react";

/* ─── Palette exacte du dashboard ─── */
const D = {
  bg:     "#0f172a",
  bg2:    "#1e293b",
  bg3:    "#334155",
  card:   "#1e293b",
  ink:    "#f1f5f9",
  ink2:   "#cbd5e1",
  ink3:   "#94a3b8",
  border: "rgba(241,245,249,0.09)",
  navy:   "#3b82f6",
  g:      "#22c55e",
  r:      "#ef4444",
  a:      "#f59e0b",
  tintG:  "rgba(34,197,94,.10)",
  tintGB: "rgba(34,197,94,.25)",
  tintR:  "rgba(239,68,68,.12)",
  tintRB: "rgba(239,68,68,.25)",
  tintN:  "rgba(59,130,246,.12)",
  tintNB: "rgba(59,130,246,.28)",
  tintA:  "rgba(245,158,11,.12)",
  tintAB: "rgba(245,158,11,.28)",
};

/* ─── Étapes de la démo ─── */
const STEPS: { id: string; label: string; dur: number }[] = [
  { id: "overview",  label: "Vue d'ensemble", dur: 4500 },
  { id: "checkin",   label: "Check-in",        dur: 4000 },
  { id: "score",     label: "Résultat",         dur: 3500 },
  { id: "trades",    label: "Log de trades",    dur: 4000 },
  { id: "rapport",   label: "Rapport",          dur: 3800 },
];

/* ─── Nav items sidebar ─── */
const NAV = [
  { id: "overview",  label: "Vue d'ensemble" },
  { id: "checkin",   label: "Check-in" },
  { id: "trades",    label: "Log de trades" },
  { id: "rapport",   label: "Rapport hebdo" },
  { id: "journal",   label: "Journal" },
  { id: "confluences", label: "Confluences" },
];

function NavIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    overview: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    checkin:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>,
    trades:   <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    rapport:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    journal:  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    confluences: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  };
  return <>{icons[id] ?? null}</>;
}

/* ════════════════════════════════
   ÉCRAN 1 — Vue d'ensemble
════════════════════════════════ */
function OverviewScreen({ p }: { p: number }) {
  const showSignal  = p > 0.08;
  const showCards   = p > 0.28;
  const showChart   = p > 0.52;
  const showBottom  = p > 0.72;

  const scores = [68, 72, 0, 82, 78, 85, 82];
  const days   = ["LU","MA","ME","JE","VE","SA","DI"];

  return (
    <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, height: "100%", boxSizing: "border-box", overflowY: "hidden" }}>

      {/* Signal */}
      <div style={{ opacity: showSignal ? 1 : 0, transform: showSignal ? "translateY(0)" : "translateY(6px)", transition: "all .45s ease", background: D.tintG, border: `1.5px solid ${D.tintGB}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          {(["GO","CAUTION","STOP"] as const).map(l => (
            <div key={l} style={{ width: 12, height: 12, borderRadius: "50%", background: l === "GO" ? "#34c45a" : "rgba(128,128,128,.15)", boxShadow: l === "GO" ? "0 0 8px rgba(52,196,90,.8)" : "none" }} />
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: D.g, textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 3 }}>Signal de session</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: D.g, marginBottom: 4 }}>État mental optimal</div>
          <div style={{ fontSize: 11, color: D.ink3, lineHeight: 1.5 }}>Bonne condition pour opérer. Applique ton plan avec discipline.</div>
        </div>
        <div style={{ fontSize: 22, flexShrink: 0 }}>✓</div>
      </div>

      {/* 4 métriques */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, opacity: showCards ? 1 : 0, transform: showCards ? "translateY(0)" : "translateY(6px)", transition: "all .45s ease .1s" }}>
        {[
          { label: "Score mental", val: "82", sub: "État optimal",      color: D.g },
          { label: "Win rate",     val: "68%", sub: "9W · 4L · 7j",    color: D.g },
          { label: "P&L net",      val: "+620€", sub: "Cette semaine",  color: D.g },
          { label: "Profit factor",val: "2.1", sub: "Stratégie rentable", color: D.g },
        ].map(m => (
          <div key={m.label} style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: m.color, lineHeight: 1, marginBottom: 3 }}>{m.val}</div>
            <div style={{ fontSize: 10, color: m.color, fontWeight: 600 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Graphique + facteur limitant */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 8, opacity: showChart ? 1 : 0, transition: "opacity .4s ease .15s" }}>
        {/* Barres */}
        <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Score mental — 7 jours</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
            {scores.map((s, i) => {
              const h = s ? Math.max(6, Math.round((s / 100) * 54)) : 4;
              const c = s >= 75 ? D.g : s >= 60 ? D.a : s ? D.r : D.bg3;
              const isToday = i === 6;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: showChart ? h : 0, background: c, borderRadius: 4, transition: `height .5s ease ${i * 0.06}s`, outline: isToday ? `1.5px solid ${c}` : "none", outlineOffset: 2 }} />
                  </div>
                  <div style={{ fontSize: 8, color: isToday ? D.ink : D.ink3, fontWeight: isToday ? 700 : 400 }}>{days[i]}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${D.border}`, fontSize: 10, color: D.ink3, display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ color: D.g, fontWeight: 700 }}>↑ +4 pts</span>
            <span>par rapport à hier</span>
          </div>
        </div>

        {/* Objectif + streak */}
        <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em" }}>Objectif du jour</div>
          <div style={{ fontSize: 11, color: D.ink2, lineHeight: 1.55, flex: 1 }}>
            Conditions optimales. Reste dans ton plan, applique tes critères d'entrée sans les assouplir.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", background: D.bg2, borderRadius: 8, border: `1px solid ${D.border}` }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: D.a }}>14 jours de streak</span>
          </div>
        </div>
      </div>

      {/* Derniers trades */}
      <div style={{ opacity: showBottom ? 1 : 0, transition: "opacity .4s ease .1s", background: D.card, border: `1px solid ${D.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Derniers trades</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { pair: "EUR/USD", dir: "Long",  pnl: "+85€",  win: true  },
            { pair: "GBP/JPY", dir: "Long",  pnl: "+140€", win: true  },
            { pair: "NAS100",  dir: "Short", pnl: "−60€",  win: false },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: i < 2 ? `1px solid ${D.border}` : "none" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.win ? D.g : D.r, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: D.ink, flex: 1 }}>{t.pair}</span>
              <span style={{ fontSize: 10, color: D.ink3 }}>{t.dir}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.win ? D.g : D.r }}>{t.pnl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   ÉCRAN 2 — Check-in
════════════════════════════════ */
const QUESTIONS = [
  { label: "Sommeil",      q: "Combien d'heures as-tu dormi ?",         opts: ["💀 <5h","😴 5-6h","😐 6-7h","😊 7-8h","⚡ 8h+"],          sel: 3 },
  { label: "Énergie",      q: "Comment te sens-tu physiquement ?",       opts: ["😴 Épuisé","😪 Fatigué","😐 Neutre","😊 Bien","⚡ Excellent"], sel: 3 },
  { label: "Concentration",q: "Ta capacité à te concentrer aujourd'hui ?",opts: ["😵 Nulle","🤔 Faible","😐 Correcte","🎯 Bonne","🧠 Optimale"], sel: 4 },
];

function CheckinScreen({ p }: { p: number }) {
  const step = p < 0.3 ? 0 : p < 0.62 ? 1 : 2;
  const chosen = p > 0.22 ? (p < 0.6 ? true : false) : false;
  const chosen2 = p > 0.55;
  const chosen3 = p > 0.82;

  return (
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14, height: "100%", boxSizing: "border-box" }}>
      {/* Progress steps */}
      <div style={{ display: "flex", gap: 4 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? D.navy : D.bg3, transition: "background .4s" }} />
        ))}
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: D.bg3 }} />
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: D.bg3 }} />
      </div>

      {QUESTIONS.map((q, qi) => (
        <div key={qi} style={{ opacity: step === qi ? 1 : step > qi ? 0.35 : 0, transform: step === qi ? "translateY(0)" : step > qi ? "translateY(-4px)" : "translateY(8px)", transition: "all .4s ease", pointerEvents: "none", display: step < qi ? "none" : "block" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>{q.label}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: D.ink, marginBottom: 12 }}>{q.q}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {q.opts.map((o, oi) => {
              const isSelected = (qi === 0 && chosen && oi === q.sel) || (qi === 1 && chosen2 && oi === q.sel) || (qi === 2 && chosen3 && oi === q.sel);
              return (
                <div key={oi} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: isSelected ? D.tintN : D.bg2, border: `1px solid ${isSelected ? D.navy : D.border}`, textAlign: "center", fontSize: 10, color: isSelected ? "#93c5fd" : D.ink3, fontWeight: isSelected ? 700 : 400, transition: "all .25s", lineHeight: 1.4 }}>
                  {o}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: "auto", opacity: step >= 2 ? 1 : 0, transition: "opacity .4s .2s" }}>
        <div style={{ background: D.navy, borderRadius: 9, padding: "11px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
          Voir mon score →
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   ÉCRAN 3 — Résultat score
════════════════════════════════ */
function ScoreScreen({ p }: { p: number }) {
  const score = Math.min(82, Math.round(p * 1.4 * 82));
  const showVerdict = p > 0.3;
  const showDesc    = p > 0.55;
  const showDetails = p > 0.72;

  return (
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: "100%", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10 }}>Score mental du jour</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 72, fontWeight: 700, color: score >= 75 ? D.g : score >= 60 ? D.a : D.r, lineHeight: 1, transition: "color .3s" }}>{score}</span>
          <span style={{ fontSize: 16, color: D.ink3 }}>/100</span>
        </div>
      </div>

      <div style={{ opacity: showVerdict ? 1 : 0, transform: showVerdict ? "translateY(0)" : "translateY(8px)", transition: "all .5s ease", display: "inline-flex", alignItems: "center", gap: 8, background: D.tintG, border: `1px solid ${D.tintGB}`, borderRadius: 20, padding: "7px 18px" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: D.g }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: D.g }}>État optimal · Tu peux trader</span>
      </div>

      <div style={{ opacity: showDesc ? 1 : 0, transition: "opacity .5s .1s", maxWidth: 320, textAlign: "center", fontSize: 12, color: D.ink3, lineHeight: 1.6 }}>
        Bonne condition pour opérer. Applique ton plan avec discipline — la sur-confiance est le risque principal dans cet état.
      </div>

      <div style={{ display: "flex", gap: 8, opacity: showDetails ? 1 : 0, transition: "opacity .5s .2s" }}>
        {[
          { label: "Sommeil",  val: "7-8h", icon: "😊" },
          { label: "Énergie",  val: "Bien",  icon: "😊" },
          { label: "Focus",    val: "Optimal",icon: "🧠" },
          { label: "Stress",   val: "Léger", icon: "🙂" },
        ].map(m => (
          <div key={m.label} style={{ background: D.bg2, border: `1px solid ${D.border}`, borderRadius: 9, padding: "9px 12px", textAlign: "center", minWidth: 60 }}>
            <div style={{ fontSize: 14, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontSize: 9, color: D.ink3, marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: D.ink }}>{m.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   ÉCRAN 4 — Log de trades
════════════════════════════════ */
const TRADE_ROWS = [
  { pair: "EUR/USD", dir: "Long",  emotion: "Calme",      res: "Gagnant",  pnl: "+85€",  score: 82, win: true  },
  { pair: "GBP/JPY", dir: "Long",  emotion: "Confiant",   res: "Gagnant",  pnl: "+140€", score: 78, win: true  },
  { pair: "NAS100",  dir: "Short", emotion: "Anxieux",    res: "Perdant",  pnl: "−60€",  score: 55, win: false },
  { pair: "BTC/USD", dir: "Long",  emotion: "Impatient",  res: "Perdant",  pnl: "−35€",  score: 62, win: false },
];

function TradesScreen({ p }: { p: number }) {
  const visible = Math.floor(p * (TRADE_ROWS.length + 1.5));
  const showStats = p > 0.78;

  return (
    <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, height: "100%", boxSizing: "border-box", overflowY: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 3 }}>Log de trades</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: D.ink }}>Historique · Avril 2026</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ label: "Win rate", val: "50%", c: D.a }, { label: "P&L", val: "+130€", c: D.g }].map(s => (
            <div key={s.label} style={{ background: D.bg2, border: `1px solid ${D.border}`, borderRadius: 8, padding: "5px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: D.ink3, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.c }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Colonnes header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr .8fr .9fr .8fr 1.1fr", gap: 0, padding: "0 2px", borderBottom: `1px solid ${D.border}`, paddingBottom: 6 }}>
        {["Paire","Direction","Résultat","P&L","Score mental"].map(h => (
          <div key={h} style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em" }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        {TRADE_ROWS.map((r, i) => (
          <div key={i} style={{ opacity: i < visible ? 1 : 0, transform: i < visible ? "translateX(0)" : "translateX(-10px)", transition: `all .35s ease ${i * 0.08}s`, display: "grid", gridTemplateColumns: "1fr .8fr .9fr .8fr 1.1fr", alignItems: "center", background: D.bg2, border: `1px solid ${D.border}`, borderRadius: 9, padding: "9px 12px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: D.ink }}>{r.pair}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: r.dir === "Long" ? D.g : D.r }}>{r.dir}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: r.win ? D.g : D.r }}>{r.res}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: r.win ? D.g : D.r }}>{r.pnl}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ flex: 1, height: 3, background: D.bg3, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${r.score}%`, background: r.score >= 75 ? D.g : r.score >= 60 ? D.a : D.r, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: D.ink3, flexShrink: 0 }}>{r.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div style={{ opacity: showStats ? 1 : 0, transform: showStats ? "translateY(0)" : "translateY(6px)", transition: "all .4s ease", background: D.tintR, border: `1px solid ${D.tintRB}`, borderRadius: 9, padding: "9px 12px", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, flexShrink: 0 }}>⚠️</span>
        <span style={{ fontSize: 11, color: D.ink2, lineHeight: 1.5 }}>Tes 2 derniers trades perdants ont été pris en état <strong style={{ color: D.r }}>Anxieux / Impatient</strong>. Évalue ton état avant d'entrer.</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════
   ÉCRAN 5 — Rapport hebdo
════════════════════════════════ */
const WEEK_BARS = [
  { day: "LUN", pnl:  85, score: 82, win: true  },
  { day: "MAR", pnl: 140, score: 78, win: true  },
  { day: "MER", pnl: -60, score: 55, win: false },
  { day: "JEU", pnl: 220, score: 88, win: true  },
  { day: "VEN", pnl:  60, score: 72, win: true  },
];

function RapportScreen({ p }: { p: number }) {
  const showBars     = p > 0.15;
  const showInsights = p > 0.55;
  const showScores   = p > 0.72;
  const maxP = 220;

  return (
    <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, height: "100%", boxSizing: "border-box", overflowY: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 3 }}>Rapport hebdomadaire</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: D.ink }}>Semaine du 14 avril</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ l: "P&L", v: "+445€", c: D.g }, { l: "Win rate", v: "80%", c: D.g }, { l: "Score moy.", v: "75", c: D.g }].map(s => (
            <div key={s.l} style={{ background: D.bg2, border: `1px solid ${D.border}`, borderRadius: 8, padding: "5px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: D.ink3, marginBottom: 2 }}>{s.l}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Barres P&L */}
      <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>P&L par jour</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 64 }}>
          {WEEK_BARS.map((b, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: 52, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <div style={{ width: "100%", height: showBars ? `${(Math.abs(b.pnl) / maxP) * 52}px` : "0px", background: b.win ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)", border: `1px solid ${b.win ? D.tintGB : D.tintRB}`, borderRadius: 5, transition: `height .55s ease ${i * 0.08}s` }} />
              </div>
              <div style={{ fontSize: 9, color: D.ink3, fontWeight: 600 }}>{b.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score mental vs P&L */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, opacity: showScores ? 1 : 0, transition: "opacity .4s ease .1s" }}>
        {[
          { title: "Meilleur état (≥75)", detail: "4 jours · +445€ · WR 80%", color: D.g, bg: D.tintG, bd: D.tintGB },
          { title: "Dégradé (<60)",       detail: "1 jour · −60€ · WR 0%",   color: D.r, bg: D.tintR, bd: D.tintRB },
        ].map(c => (
          <div key={c.title} style={{ background: c.bg, border: `1px solid ${c.bd}`, borderRadius: 9, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: D.ink2 }}>{c.detail}</div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: showInsights ? 1 : 0, transform: showInsights ? "translateY(0)" : "translateY(6px)", transition: "all .45s ease .1s" }}>
        {[
          { icon: "📈", text: "Tes meilleures sessions coïncident avec un score ≥ 78.", c: D.tintG, b: D.tintGB },
          { icon: "🔴", text: "Mercredi (score 55) : −60€. Évite de trader sous 60.", c: D.tintR, b: D.tintRB },
        ].map((ins, i) => (
          <div key={i} style={{ background: ins.c, border: `1px solid ${ins.b}`, borderRadius: 8, padding: "8px 12px", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, flexShrink: 0 }}>{ins.icon}</span>
            <span style={{ fontSize: 11, color: D.ink2, lineHeight: 1.5 }}>{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   COMPOSANT PRINCIPAL
════════════════════════════════ */
export default function ProductTour() {
  const [stepIdx, setStepIdx]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading]     = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const dur = STEPS[stepIdx].dur;
      const p = Math.min(elapsed / dur, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setFading(true);
        setTimeout(() => {
          setStepIdx(i => (i + 1) % STEPS.length);
          setProgress(0);
          setFading(false);
        }, 380);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stepIdx]);

  function goTo(i: number) {
    cancelAnimationFrame(rafRef.current);
    setFading(true);
    setTimeout(() => { setStepIdx(i); setProgress(0); setFading(false); }, 200);
  }

  const activeNav = STEPS[stepIdx].id === "overview" ? "overview"
    : STEPS[stepIdx].id === "checkin" || STEPS[stepIdx].id === "score" ? "checkin"
    : STEPS[stepIdx].id === "trades"  ? "trades"
    : STEPS[stepIdx].id === "rapport" ? "rapport"
    : "overview";

  return (
    <section style={{ padding: "120px 5%", background: "#0a0f1a", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(ellipse, rgba(15,39,68,.8) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "15%", width: 350, height: 350, background: "radial-gradient(circle, rgba(59,130,246,.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 14 }}>Le produit</div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.025em", color: "#fff", marginBottom: 14 }}>
            Ton copilote mental.<br />
            <span style={{ color: "rgba(255,255,255,.35)" }}>Ouvert avant chaque session.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Un dashboard conçu pour te rendre plus discipliné — pas plus occupé.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)} style={{
              background: stepIdx === i ? "rgba(59,130,246,.18)" : "rgba(255,255,255,.04)",
              border: `1px solid ${stepIdx === i ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.08)"}`,
              borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 600,
              color: stepIdx === i ? "#93c5fd" : "rgba(255,255,255,.35)",
              cursor: "pointer", transition: "all .2s",
            }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Fenêtre browser */}
        <div style={{
          borderRadius: 16, overflow: "hidden",
          border: "1px solid rgba(255,255,255,.09)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.04), 0 48px 120px rgba(0,0,0,.75)",
          background: D.bg,
        }}>
          {/* Chrome bar */}
          <div style={{ height: 38, background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 16px", gap: 10 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[D.r, D.a, D.g].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: .45 }} />)}
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 6, height: 22, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 260, margin: "0 auto" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: ".02em" }}>mindtrade.co/dashboard</span>
            </div>
          </div>

          {/* App layout */}
          <div style={{ display: "flex", height: 400 }}>

            {/* Sidebar */}
            <div style={{ width: 170, background: D.card, borderRight: `1px solid ${D.border}`, padding: "10px 7px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              {/* Brand */}
              <div style={{ padding: "4px 8px 12px", borderBottom: `1px solid ${D.border}`, marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 12, fontWeight: 900, color: D.ink, letterSpacing: "-.3px" }}>MindTrade</span>
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                {NAV.map(n => {
                  const active = n.id === activeNav;
                  return (
                    <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", borderRadius: 7, background: active ? D.bg2 : "transparent", border: `1px solid ${active ? D.border : "transparent"}`, color: active ? D.ink : D.ink3, fontSize: 11, fontWeight: active ? 600 : 500 }}>
                      <span style={{ opacity: active ? 1 : 0.5, flexShrink: 0 }}><NavIcon id={n.id} /></span>
                      {n.label}
                    </div>
                  );
                })}
              </nav>
              {/* Score widget */}
              <div style={{ marginTop: 10, borderTop: `1px solid ${D.border}`, paddingTop: 10 }}>
                <div style={{ background: D.bg2, border: `1px solid ${D.border}`, borderRadius: 9, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: D.ink3, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Score mental</div>
                  <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, fontWeight: 700, color: D.g, lineHeight: 1, marginBottom: 2 }}>82</div>
                  <div style={{ fontSize: 10, color: D.g, fontWeight: 600, marginBottom: 6 }}>État optimal</div>
                  <div style={{ height: 3, background: D.bg3, borderRadius: 2 }}>
                    <div style={{ height: "100%", width: "82%", background: D.g, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 10, color: D.ink3, marginTop: 5 }}>🔥 14j de streak</div>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div style={{ flex: 1, overflowY: "hidden", opacity: fading ? 0 : 1, transition: "opacity .3s ease" }}>
              {STEPS[stepIdx].id === "overview"  && <OverviewScreen p={progress} />}
              {STEPS[stepIdx].id === "checkin"   && <CheckinScreen  p={progress} />}
              {STEPS[stepIdx].id === "score"     && <ScoreScreen    p={progress} />}
              {STEPS[stepIdx].id === "trades"    && <TradesScreen   p={progress} />}
              {STEPS[stepIdx].id === "rapport"   && <RapportScreen  p={progress} />}
            </div>
          </div>

          {/* Barre de progression */}
          <div style={{ height: 2, background: "rgba(255,255,255,.05)" }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${D.navy}, #60a5fa)`, transition: "width .08s linear" }} />
          </div>
        </div>

        {/* Légende */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 32, flexWrap: "wrap" }}>
          {[
            { dot: D.g,    label: "Score mental calculé automatiquement" },
            { dot: D.a,    label: "Biais détectés en temps réel" },
            { dot: "#93c5fd", label: "Performance corrélée à l'état mental" },
          ].map(a => (
            <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,.3)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
              {a.label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
