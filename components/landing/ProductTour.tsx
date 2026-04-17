"use client";

import { useEffect, useState, useRef, useMemo } from "react";

/* ─── Palettes thème ─── */
const DARK = {
  bg: "#0f172a", bg2: "#1e293b", bg3: "#334155", card: "#1e293b",
  ink: "#f1f5f9", ink2: "#cbd5e1", ink3: "#94a3b8",
  border: "rgba(241,245,249,0.09)", navy: "#3b82f6",
  g: "#22c55e", r: "#ef4444", a: "#f59e0b",
  tintG: "rgba(34,197,94,.10)", tintGB: "rgba(34,197,94,.25)",
  tintR: "rgba(239,68,68,.12)", tintRB: "rgba(239,68,68,.25)",
  tintN: "rgba(59,130,246,.12)", tintNB: "rgba(59,130,246,.28)",
  tintA: "rgba(245,158,11,.12)", tintAB: "rgba(245,158,11,.28)",
};
const LIGHT = {
  bg: "#e2e8f0", bg2: "#edf1f7", bg3: "#d4dce8", card: "#f8fafc",
  ink: "#0f172a", ink2: "#4a5568", ink3: "#94a3b8",
  border: "rgba(15,23,42,0.09)", navy: "#3b82f6",
  g: "#16a34a", r: "#dc2626", a: "#c2410c",
  tintG: "rgba(34,197,94,.10)", tintGB: "rgba(34,197,94,.35)",
  tintR: "rgba(239,68,68,.10)", tintRB: "rgba(239,68,68,.35)",
  tintN: "rgba(59,130,246,.10)", tintNB: "rgba(59,130,246,.35)",
  tintA: "#fffbeb", tintAB: "#ea580c",
};

/* ─── Étapes ─── */
const STEPS = [
  { id: "overview",  label: "Vue d'ensemble", dur: 4800 },
  { id: "checkin",   label: "Check-in",        dur: 4200 },
  { id: "score",     label: "Score",            dur: 3600 },
  { id: "trades",    label: "Log de trades",    dur: 4200 },
  { id: "rapport",   label: "Rapport",          dur: 3800 },
  { id: "settings",  label: "Paramètres",       dur: 3400 },
];

/* ─── Waypoints curseur (% de la zone content) ─── */
type WP = { p: number; x: number; y: number; click?: boolean };
const WAYPOINTS: Record<string, WP[]> = {
  overview: [
    { p: 0.05, x: 55, y: 14 },
    { p: 0.18, x: 55, y: 14, click: true },
    { p: 0.38, x: 14, y: 53 },
    { p: 0.50, x: 14, y: 53, click: true },
    { p: 0.65, x: 42, y: 53 },
    { p: 0.80, x: 70, y: 53 },
    { p: 0.92, x: 88, y: 53 },
  ],
  checkin: [
    { p: 0.08, x: 68, y: 35 },
    { p: 0.22, x: 68, y: 35, click: true },
    { p: 0.38, x: 75, y: 52 },
    { p: 0.50, x: 75, y: 52, click: true },
    { p: 0.66, x: 86, y: 68 },
    { p: 0.76, x: 86, y: 68, click: true },
    { p: 0.90, x: 50, y: 89 },
    { p: 0.96, x: 50, y: 89, click: true },
  ],
  score: [
    { p: 0.10, x: 33, y: 30 },
    { p: 0.38, x: 40, y: 52 },
    { p: 0.62, x: 22, y: 76 },
    { p: 0.85, x: 55, y: 76 },
  ],
  trades: [
    { p: 0.08, x: 50, y: 40 },
    { p: 0.28, x: 50, y: 52, click: true },
    { p: 0.48, x: 50, y: 63 },
    { p: 0.65, x: 50, y: 63, click: true },
    { p: 0.82, x: 50, y: 85 },
  ],
  rapport: [
    { p: 0.12, x: 68, y: 42 },
    { p: 0.28, x: 68, y: 42, click: true },
    { p: 0.50, x: 42, y: 42 },
    { p: 0.68, x: 50, y: 68 },
    { p: 0.85, x: 50, y: 80 },
  ],
  settings: [
    { p: 0.10, x: 50, y: 20 },
    { p: 0.30, x: 50, y: 40, click: true },
    { p: 0.55, x: 50, y: 60 },
    { p: 0.75, x: 30, y: 78, click: true },
    { p: 0.90, x: 70, y: 78 },
  ],
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function getCursor(stepId: string, p: number) {
  const wps = WAYPOINTS[stepId] ?? [];
  if (!wps.length) return { x: 50, y: 50, clicking: false };
  if (p <= wps[0].p) return { x: wps[0].x, y: wps[0].y, clicking: false };
  if (p >= wps[wps.length - 1].p) return { x: wps[wps.length - 1].x, y: wps[wps.length - 1].y, clicking: false };
  for (let i = 0; i < wps.length - 1; i++) {
    if (p >= wps[i].p && p <= wps[i + 1].p) {
      const t = easeInOut((p - wps[i].p) / (wps[i + 1].p - wps[i].p));
      const clicking = wps[i].click === true && (p - wps[i].p) / (wps[i + 1].p - wps[i].p) < 0.35;
      return { x: lerp(wps[i].x, wps[i + 1].x, t), y: lerp(wps[i].y, wps[i + 1].y, t), clicking };
    }
  }
  return { x: 50, y: 50, clicking: false };
}

/* ─── Nav sidebar ─── */
const NAV = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "checkin",  label: "Check-in" },
  { id: "trades",   label: "Log de trades" },
  { id: "rapport",  label: "Rapport hebdo" },
  { id: "journal",  label: "Journal" },
  { id: "confluences", label: "Confluences" },
  { id: "settings", label: "Paramètres" },
];

function NavIcon({ id }: { id: string }) {
  if (id === "overview")    return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (id === "checkin")     return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>;
  if (id === "trades")      return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
  if (id === "rapport")     return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
  if (id === "journal")     return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
  if (id === "confluences") return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
  if (id === "settings")    return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
  return null;
}

/* ══════════════════════════════════════════
   ÉCRANS
══════════════════════════════════════════ */

function OverviewScreen({ p, T }: { p: number; T: typeof DARK }) {
  const s1 = p > 0.08; const s2 = p > 0.28; const s3 = p > 0.50; const s4 = p > 0.72;
  const scores = [68, 72, 0, 82, 78, 85, 82];
  const days = ["LU","MA","ME","JE","VE","SA","DI"];
  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 9, height: "100%", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ opacity: s1?1:0, transform: s1?"translateY(0)":"translateY(6px)", transition:"all .45s", background:T.tintG, border:`1.5px solid ${T.tintGB}`, borderRadius:11, padding:"12px 16px", display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
          {(["GO","CAUTION","STOP"] as const).map(l=>(
            <div key={l} style={{ width:11, height:11, borderRadius:"50%", background:l==="GO"?"#34c45a":"rgba(128,128,128,.15)", boxShadow:l==="GO"?"0 0 8px rgba(52,196,90,.8)":"none" }} />
          ))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.g, textTransform:"uppercase", letterSpacing:".14em", marginBottom:3 }}>Signal de session</div>
          <div style={{ fontSize:14, fontWeight:800, color:T.g, marginBottom:3 }}>État mental optimal</div>
          <div style={{ fontSize:11, color:T.ink3, lineHeight:1.5 }}>Bonne condition pour opérer. Applique ton plan avec discipline.</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:7, opacity:s2?1:0, transform:s2?"translateY(0)":"translateY(6px)", transition:"all .45s .1s" }}>
        {[{l:"Score mental",v:"82",s:"État optimal",c:T.g},{l:"Win rate",v:"68%",s:"9W · 4L",c:T.g},{l:"P&L net",v:"+620€",s:"Cette semaine",c:T.g},{l:"Profit factor",v:"2.1",s:"Rentable",c:T.g}].map(m=>(
          <div key={m.l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 12px" }}>
            <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:5 }}>{m.l}</div>
            <div style={{ fontFamily:"var(--font-fraunces)", fontSize:24, fontWeight:700, color:m.c, lineHeight:1, marginBottom:2 }}>{m.v}</div>
            <div style={{ fontSize:10, color:m.c, fontWeight:600 }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:8, opacity:s3?1:0, transition:"opacity .4s .1s" }}>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Score mental — 7 jours</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:52 }}>
            {scores.map((sc,i)=>{
              const h=sc?Math.max(5,Math.round((sc/100)*46)):4;
              const c=sc>=75?T.g:sc>=60?T.a:sc?T.r:T.bg3;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, height:"100%" }}>
                  <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
                    <div style={{ width:"100%", height:s3?h:0, background:c, borderRadius:4, transition:`height .5s ease ${i*.06}s`, outline:i===6?`1.5px solid ${c}`:"none", outlineOffset:2 }} />
                  </div>
                  <div style={{ fontSize:8, color:i===6?T.ink:T.ink3, fontWeight:i===6?700:400 }}>{days[i]}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 12px", display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em" }}>Objectif du jour</div>
          <div style={{ fontSize:11, color:T.ink2, lineHeight:1.55, flex:1 }}>Conditions optimales. Applique tes critères sans assouplissement.</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 9px", background:T.bg2, borderRadius:7, border:`1px solid ${T.border}` }}>
            <span style={{ fontSize:11 }}>🔥</span><span style={{ fontSize:10, fontWeight:700, color:T.a }}>14j de streak</span>
          </div>
        </div>
      </div>
      <div style={{ opacity:s4?1:0, transition:"opacity .4s .1s", background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"10px 12px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:7 }}>Derniers trades</div>
        {[{pair:"EUR/USD",dir:"Long",pnl:"+85€",win:true},{pair:"GBP/JPY",dir:"Long",pnl:"+140€",win:true},{pair:"NAS100",dir:"Short",pnl:"−60€",win:false}].map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"4px 0", borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:t.win?T.g:T.r, flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:600, color:T.ink, flex:1 }}>{t.pair}</span>
            <span style={{ fontSize:10, color:T.ink3 }}>{t.dir}</span>
            <span style={{ fontSize:11, fontWeight:700, color:t.win?T.g:T.r }}>{t.pnl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const QS = [
  { label:"Sommeil", q:"Combien d'heures as-tu dormi ?", opts:["💀 <5h","😴 5-6h","😐 6-7h","😊 7-8h","⚡ 8h+"], sel:3 },
  { label:"Énergie", q:"Comment te sens-tu physiquement ?", opts:["😴 Épuisé","😪 Fatigué","😐 Neutre","😊 Bien","⚡ Excellent"], sel:3 },
  { label:"Concentration", q:"Ta capacité à te concentrer aujourd'hui ?", opts:["😵 Nulle","🤔 Faible","😐 Correcte","🎯 Bonne","🧠 Optimale"], sel:4 },
];

function CheckinScreen({ p, T }: { p: number; T: typeof DARK }) {
  const step = p < 0.3 ? 0 : p < 0.62 ? 1 : 2;
  const c1=p>0.22, c2=p>0.55, c3=p>0.82;
  return (
    <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12, height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", gap:4 }}>
        {QS.map((_,i)=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=step?T.navy:T.bg3, transition:"background .4s" }}/>)}
        <div style={{ flex:1, height:3, borderRadius:2, background:T.bg3 }}/>
        <div style={{ flex:1, height:3, borderRadius:2, background:T.bg3 }}/>
      </div>
      {QS.map((q,qi)=>(
        <div key={qi} style={{ opacity:step===qi?1:step>qi?0.3:0, transform:step===qi?"translateY(0)":step>qi?"translateY(-4px)":"translateY(8px)", transition:"all .4s ease", display:step<qi?"none":"block" }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:5 }}>{q.label}</div>
          <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:10 }}>{q.q}</div>
          <div style={{ display:"flex", gap:5 }}>
            {q.opts.map((o,oi)=>{
              const sel=(qi===0&&c1&&oi===q.sel)||(qi===1&&c2&&oi===q.sel)||(qi===2&&c3&&oi===q.sel);
              return <div key={oi} style={{ flex:1, padding:"7px 3px", borderRadius:7, background:sel?T.tintN:T.bg2, border:`1px solid ${sel?T.navy:T.border}`, textAlign:"center", fontSize:10, color:sel?"#93c5fd":T.ink3, fontWeight:sel?700:400, transition:"all .25s", lineHeight:1.4 }}>{o}</div>;
            })}
          </div>
        </div>
      ))}
      <div style={{ marginTop:"auto", opacity:step>=2?1:0, transition:"opacity .4s .2s" }}>
        <div style={{ background:T.navy, borderRadius:8, padding:"11px", textAlign:"center", fontSize:13, fontWeight:700, color:"#fff" }}>Voir mon score →</div>
      </div>
    </div>
  );
}

function ScoreScreen({ p, T }: { p: number; T: typeof DARK }) {
  const score = Math.min(82, Math.round(p * 1.5 * 82));
  const s1=p>0.28, s2=p>0.52, s3=p>0.70;
  return (
    <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, height:"100%", boxSizing:"border-box" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:10 }}>Score mental du jour</div>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:5 }}>
          <span style={{ fontFamily:"var(--font-fraunces)", fontSize:68, fontWeight:700, color:score>=75?T.g:score>=60?T.a:T.r, lineHeight:1, transition:"color .3s" }}>{score}</span>
          <span style={{ fontSize:14, color:T.ink3 }}>/100</span>
        </div>
      </div>
      <div style={{ opacity:s1?1:0, transform:s1?"translateY(0)":"translateY(8px)", transition:"all .5s", display:"inline-flex", alignItems:"center", gap:7, background:T.tintG, border:`1px solid ${T.tintGB}`, borderRadius:20, padding:"6px 16px" }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:T.g }} />
        <span style={{ fontSize:12, fontWeight:700, color:T.g }}>État optimal · Tu peux trader</span>
      </div>
      <div style={{ opacity:s2?1:0, transition:"opacity .5s .1s", maxWidth:300, textAlign:"center", fontSize:11, color:T.ink3, lineHeight:1.6 }}>
        Bonne condition pour opérer. Applique ton plan avec discipline — la sur-confiance est le risque principal dans cet état.
      </div>
      <div style={{ display:"flex", gap:7, opacity:s3?1:0, transition:"opacity .5s .2s" }}>
        {[{l:"Sommeil",v:"7-8h",i:"😊"},{l:"Énergie",v:"Bien",i:"😊"},{l:"Focus",v:"Optimal",i:"🧠"},{l:"Stress",v:"Léger",i:"🙂"}].map(m=>(
          <div key={m.l} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
            <div style={{ fontSize:13, marginBottom:3 }}>{m.i}</div>
            <div style={{ fontSize:9, color:T.ink3, marginBottom:2 }}>{m.l}</div>
            <div style={{ fontSize:10, fontWeight:700, color:T.ink }}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TRADES = [
  { pair:"EUR/USD", dir:"Long",  emotion:"Calme",    res:"Gagnant",  pnl:"+85€",  score:82, win:true  },
  { pair:"GBP/JPY", dir:"Long",  emotion:"Confiant", res:"Gagnant",  pnl:"+140€", score:78, win:true  },
  { pair:"NAS100",  dir:"Short", emotion:"Anxieux",  res:"Perdant",  pnl:"−60€",  score:55, win:false },
  { pair:"BTC/USD", dir:"Long",  emotion:"Impatient",res:"Perdant",  pnl:"−35€",  score:62, win:false },
];

function TradesScreen({ p, T }: { p: number; T: typeof DARK }) {
  const visible = Math.floor(p * (TRADES.length + 1.5));
  const showI = p > 0.78;
  return (
    <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:9, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:2 }}>Log de trades</div>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Historique · Avril 2026</div>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[{l:"Win rate",v:"50%",c:T.a},{l:"P&L",v:"+130€",c:T.g}].map(s=>(
            <div key={s.l} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:7, padding:"4px 9px", textAlign:"center" }}>
              <div style={{ fontSize:8, color:T.ink3, marginBottom:1 }}>{s.l}</div>
              <div style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr .8fr .9fr .7fr 1fr", gap:0, padding:"0 2px", borderBottom:`1px solid ${T.border}`, paddingBottom:5 }}>
        {["Paire","Direction","Résultat","P&L","Score mental"].map(h=>(
          <div key={h} style={{ fontSize:8, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em" }}>{h}</div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:5, flex:1 }}>
        {TRADES.map((r,i)=>(
          <div key={i} style={{ opacity:i<visible?1:0, transform:i<visible?"translateX(0)":"translateX(-10px)", transition:`all .35s ease ${i*.08}s`, display:"grid", gridTemplateColumns:"1fr .8fr .9fr .7fr 1fr", alignItems:"center", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 11px" }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.ink }}>{r.pair}</span>
            <span style={{ fontSize:10, fontWeight:600, color:r.dir==="Long"?T.g:T.r }}>{r.dir}</span>
            <span style={{ fontSize:10, fontWeight:600, color:r.win?T.g:T.r }}>{r.res}</span>
            <span style={{ fontSize:11, fontWeight:700, color:r.win?T.g:T.r }}>{r.pnl}</span>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ flex:1, height:3, background:T.bg3, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${r.score}%`, background:r.score>=75?T.g:r.score>=60?T.a:T.r, borderRadius:2 }} />
              </div>
              <span style={{ fontSize:9, color:T.ink3, flexShrink:0 }}>{r.score}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ opacity:showI?1:0, transform:showI?"translateY(0)":"translateY(6px)", transition:"all .4s", background:T.tintR, border:`1px solid ${T.tintRB}`, borderRadius:8, padding:"8px 11px", display:"flex", gap:7 }}>
        <span style={{ fontSize:11, flexShrink:0 }}>⚠️</span>
        <span style={{ fontSize:11, color:T.ink2, lineHeight:1.5 }}>Tes 2 derniers perdants pris en état <strong style={{ color:T.r }}>Anxieux / Impatient</strong>. Évalue ton état avant d'entrer.</span>
      </div>
    </div>
  );
}

const WBARS = [
  { day:"LUN", pnl:85,  score:82, win:true  },
  { day:"MAR", pnl:140, score:78, win:true  },
  { day:"MER", pnl:-60, score:55, win:false },
  { day:"JEU", pnl:220, score:88, win:true  },
  { day:"VEN", pnl:60,  score:72, win:true  },
];

function RapportScreen({ p, T }: { p: number; T: typeof DARK }) {
  const s1=p>0.15, s2=p>0.55, s3=p>0.72;
  return (
    <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:2 }}>Rapport hebdomadaire</div>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Semaine du 14 avril</div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[{l:"P&L",v:"+445€",c:T.g},{l:"Win rate",v:"80%",c:T.g},{l:"Moy. score",v:"75",c:T.g}].map(s=>(
            <div key={s.l} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:7, padding:"4px 9px", textAlign:"center" }}>
              <div style={{ fontSize:8, color:T.ink3, marginBottom:1 }}>{s.l}</div>
              <div style={{ fontSize:11, fontWeight:700, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 12px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:9 }}>P&L par jour</div>
        <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:58 }}>
          {WBARS.map((b,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", height:52, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                <div style={{ width:"100%", height:s1?`${(Math.abs(b.pnl)/220)*48}px`:"0px", background:b.win?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)", border:`1px solid ${b.win?T.tintGB:T.tintRB}`, borderRadius:5, transition:`height .55s ease ${i*.08}s` }} />
              </div>
              <div style={{ fontSize:8, color:T.ink3, fontWeight:600 }}>{b.day}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, opacity:s3?1:0, transition:"opacity .4s .1s" }}>
        {[{t:"Meilleur état (≥75)",d:"4j · +445€ · WR 80%",c:T.g,bg:T.tintG,bd:T.tintGB},{t:"Dégradé (<60)",d:"1j · −60€ · WR 0%",c:T.r,bg:T.tintR,bd:T.tintRB}].map(c=>(
          <div key={c.t} style={{ background:c.bg, border:`1px solid ${c.bd}`, borderRadius:8, padding:"9px 11px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:c.c, marginBottom:3 }}>{c.t}</div>
            <div style={{ fontSize:10, color:T.ink2 }}>{c.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, opacity:s2?1:0, transform:s2?"translateY(0)":"translateY(6px)", transition:"all .45s .1s" }}>
        {[{i:"📈",t:"Tes meilleures sessions coïncident avec un score ≥ 78.",c:T.tintG,b:T.tintGB},{i:"🔴",t:"Mercredi (score 55) : −60€. Évite de trader sous 60.",c:T.tintR,b:T.tintRB}].map((ins,i)=>(
          <div key={i} style={{ background:ins.c, border:`1px solid ${ins.b}`, borderRadius:7, padding:"7px 11px", display:"flex", gap:7, alignItems:"flex-start" }}>
            <span style={{ fontSize:11, flexShrink:0 }}>{ins.i}</span>
            <span style={{ fontSize:11, color:T.ink2, lineHeight:1.5 }}>{ins.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ p, T }: { p: number; T: typeof DARK }) {
  const s1=p>0.10, s2=p>0.35, s3=p>0.60;
  return (
    <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:2 }}>Paramètres</div>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Mon compte</div>
      </div>
      <div style={{ opacity:s1?1:0, transform:s1?"translateY(0)":"translateY(6px)", transition:"all .4s", background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"12px 14px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Profil</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[{l:"Prénom affiché",v:"Thomas"},{l:"Email",v:"thomas@gmail.com"}].map(f=>(
            <div key={f.l}>
              <div style={{ fontSize:10, fontWeight:600, color:T.ink2, marginBottom:4 }}>{f.l}</div>
              <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, padding:"8px 11px", fontSize:12, color:T.ink }}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ opacity:s2?1:0, transform:s2?"translateY(0)":"translateY(6px)", transition:"all .4s .05s", background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"12px 14px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Trading</div>
        <div>
          <div style={{ fontSize:10, fontWeight:600, color:T.ink2, marginBottom:4 }}>Capital de trading</div>
          <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, padding:"8px 11px", fontSize:12, color:T.ink }}>10 000 €</div>
          <div style={{ fontSize:10, color:T.ink3, marginTop:4 }}>Permet de calculer le % de P&L sur tes trades.</div>
        </div>
      </div>
      <div style={{ opacity:s3?1:0, transform:s3?"translateY(0)":"translateY(6px)", transition:"all .4s .1s", background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"12px 14px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Apparence</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:T.ink, marginBottom:2 }}>Thème sombre</div>
            <div style={{ fontSize:10, color:T.ink3 }}>Basculer entre thème clair et sombre</div>
          </div>
          <div style={{ width:38, height:22, borderRadius:11, background:T.navy, display:"flex", alignItems:"center", padding:"0 3px", justifyContent:"flex-end" }}>
            <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════ */
export default function ProductTour() {
  const [stepIdx, setStepIdx]   = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading]     = useState(false);
  const [darkDemo, setDarkDemo] = useState(true);
  const rafRef = useRef<number>(0);

  const T = darkDemo ? DARK : LIGHT;

  useEffect(() => {
    let start: number | null = null;
    function tick(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / STEPS[stepIdx].dur, 1);
      setProgress(p);
      if (p < 1) { rafRef.current = requestAnimationFrame(tick); }
      else {
        setFading(true);
        setTimeout(() => { setStepIdx(i => (i + 1) % STEPS.length); setProgress(0); setFading(false); }, 380);
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

  const cursor = useMemo(() => getCursor(STEPS[stepIdx].id, progress), [stepIdx, progress]);

  const activeNav = ["checkin","score"].includes(STEPS[stepIdx].id) ? "checkin"
    : STEPS[stepIdx].id === "overview" ? "overview"
    : STEPS[stepIdx].id === "settings" ? "settings"
    : STEPS[stepIdx].id;

  // Cursor position relative to content area → full window
  // Sidebar: 162px, Chrome bar: 36px, total window ~880px wide, 436px tall
  const sidebarW = 162, topbarH = 36, winH = 436;
  const contentW = 880 - sidebarW;
  const cursorLeft = sidebarW + (cursor.x / 100) * contentW;
  const cursorTop  = topbarH  + (cursor.y / 100) * (winH - topbarH);

  return (
    <section id="produit" style={{ padding: "120px 5%", background: "#0a0f1a", position: "relative", overflow: "hidden" }}>
      <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translateX(-50%)", width:900, height:500, background:"radial-gradient(ellipse, rgba(15,39,68,.8) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".14em", marginBottom:14 }}>Le produit</div>
          <h2 style={{ fontFamily:"var(--font-fraunces)", fontSize:"clamp(30px,4vw,52px)", fontWeight:700, lineHeight:1.08, letterSpacing:"-.025em", color:"#fff", marginBottom:14 }}>
            Ton copilote mental.<br/>
            <span style={{ color:"rgba(255,255,255,.35)" }}>Ouvert avant chaque session.</span>
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.4)", maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>
            Un dashboard conçu pour te rendre plus discipliné — pas plus occupé.
          </p>
        </div>

        {/* Tabs + toggle thème */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {STEPS.map((s,i)=>(
              <button key={s.id} onClick={()=>goTo(i)} style={{ background:stepIdx===i?"rgba(59,130,246,.18)":"rgba(255,255,255,.04)", border:`1px solid ${stepIdx===i?"rgba(59,130,246,.4)":"rgba(255,255,255,.08)"}`, borderRadius:20, padding:"5px 14px", fontSize:11, fontWeight:600, color:stepIdx===i?"#93c5fd":"rgba(255,255,255,.35)", cursor:"pointer", transition:"all .2s" }}>
                {s.label}
              </button>
            ))}
          </div>
          {/* Toggle thème */}
          <button onClick={()=>setDarkDemo(d=>!d)} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:"5px 14px", cursor:"pointer", transition:"all .2s" }}>
            <span style={{ fontSize:12 }}>{darkDemo?"☀️":"🌙"}</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,.5)", fontWeight:600 }}>{darkDemo?"Thème clair":"Thème sombre"}</span>
          </button>
        </div>

        {/* Fenêtre browser */}
        <div style={{ borderRadius:14, overflow:"hidden", border:`1px solid rgba(255,255,255,.09)`, boxShadow:"0 0 0 1px rgba(255,255,255,.04), 0 48px 120px rgba(0,0,0,.75)", background:T.bg, position:"relative" }}>

          {/* Chrome bar */}
          <div style={{ height:36, background:darkDemo?"rgba(255,255,255,.03)":T.card, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 14px", gap:9 }}>
            <div style={{ display:"flex", gap:5 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i)=><div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c, opacity:.5 }}/>)}
            </div>
            <div style={{ flex:1, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:5, height:20, display:"flex", alignItems:"center", justifyContent:"center", maxWidth:240, margin:"0 auto" }}>
              <span style={{ fontSize:9, color:T.ink3, letterSpacing:".02em" }}>mindtrade.co/dashboard</span>
            </div>
          </div>

          {/* Layout */}
          <div style={{ display:"flex", height:400, position:"relative" }}>

            {/* Sidebar */}
            <div style={{ width:162, background:T.card, borderRight:`1px solid ${T.border}`, padding:"9px 6px", display:"flex", flexDirection:"column", flexShrink:0, zIndex:2 }}>
              <div style={{ padding:"3px 7px 10px", borderBottom:`1px solid ${T.border}`, marginBottom:7 }}>
                <span style={{ fontFamily:"var(--font-montserrat)", fontSize:12, fontWeight:900, color:T.ink, letterSpacing:"-.3px" }}>MindTrade</span>
              </div>
              <nav style={{ display:"flex", flexDirection:"column", gap:1, flex:1 }}>
                {NAV.map(n=>{
                  const active=n.id===activeNav;
                  return (
                    <div key={n.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:6, background:active?T.bg2:"transparent", border:`1px solid ${active?T.border:"transparent"}`, color:active?T.ink:T.ink3, fontSize:10.5, fontWeight:active?600:500 }}>
                      <span style={{ opacity:active?1:.5, flexShrink:0 }}><NavIcon id={n.id}/></span>
                      {n.label}
                    </div>
                  );
                })}
              </nav>
              <div style={{ marginTop:9, borderTop:`1px solid ${T.border}`, paddingTop:9 }}>
                <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, padding:"9px 10px" }}>
                  <div style={{ fontSize:8, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:3 }}>Score mental</div>
                  <div style={{ fontFamily:"var(--font-fraunces)", fontSize:22, fontWeight:700, color:T.g, lineHeight:1, marginBottom:2 }}>82</div>
                  <div style={{ fontSize:9, color:T.g, fontWeight:600, marginBottom:5 }}>État optimal</div>
                  <div style={{ height:3, background:T.bg3, borderRadius:2 }}>
                    <div style={{ height:"100%", width:"82%", background:T.g, borderRadius:2 }}/>
                  </div>
                  <div style={{ fontSize:9, color:T.ink3, marginTop:4 }}>🔥 14j de streak</div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div style={{ flex:1, overflow:"hidden", opacity:fading?0:1, transition:"opacity .3s ease", position:"relative", zIndex:1 }}>
              {STEPS[stepIdx].id==="overview"  && <OverviewScreen p={progress} T={T}/>}
              {STEPS[stepIdx].id==="checkin"   && <CheckinScreen  p={progress} T={T}/>}
              {STEPS[stepIdx].id==="score"     && <ScoreScreen    p={progress} T={T}/>}
              {STEPS[stepIdx].id==="trades"    && <TradesScreen   p={progress} T={T}/>}
              {STEPS[stepIdx].id==="rapport"   && <RapportScreen  p={progress} T={T}/>}
              {STEPS[stepIdx].id==="settings"  && <SettingsScreen p={progress} T={T}/>}
            </div>

            {/* ─── Curseur animé ─── */}
            {!fading && (
              <div style={{ position:"absolute", left:cursorLeft, top:cursorTop, transform:"translate(-4px,-4px)", transition:"left .55s cubic-bezier(.25,.46,.45,.94), top .55s cubic-bezier(.25,.46,.45,.94)", pointerEvents:"none", zIndex:20 }}>
                {/* Click ripple */}
                {cursor.clicking && (
                  <div style={{ position:"absolute", width:24, height:24, borderRadius:"50%", background:"rgba(59,130,246,.25)", border:"1px solid rgba(59,130,246,.5)", top:-8, left:-8, animation:"ripple .5s ease-out forwards" }} />
                )}
                {/* Cursor SVG */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l5.5 13.5 2.5-5.5 5.5-2.5L2 2z" fill="white" stroke="#1e40af" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ height:2, background:"rgba(255,255,255,.05)" }}>
            <div style={{ height:"100%", width:`${progress*100}%`, background:`linear-gradient(90deg, ${T.navy}, #60a5fa)`, transition:"width .08s linear" }}/>
          </div>
        </div>

        {/* Légende */}
        <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:28, flexWrap:"wrap" }}>
          {[{dot:DARK.g,label:"Score mental calculé automatiquement"},{dot:DARK.a,label:"Biais détectés en temps réel"},{dot:"#93c5fd",label:"Performance corrélée à l'état mental"}].map(a=>(
            <div key={a.label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"rgba(255,255,255,.3)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:a.dot, flexShrink:0 }}/>
              {a.label}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ripple {
          from { opacity: 1; transform: scale(0.5); }
          to   { opacity: 0; transform: scale(2.2); }
        }
      `}</style>
    </section>
  );
}
