"use client";

import { useEffect, useState, useRef } from "react";

/* ─── Palettes ─── */
const DARK = {
  bg:"#0f172a", bg2:"#1e293b", bg3:"#334155", card:"#1e293b",
  ink:"#f1f5f9", ink2:"#cbd5e1", ink3:"#94a3b8",
  border:"rgba(241,245,249,0.09)", navy:"#3b82f6",
  g:"#22c55e", r:"#ef4444", a:"#f59e0b",
  tintG:"rgba(34,197,94,.10)", tintGB:"rgba(34,197,94,.25)",
  tintR:"rgba(239,68,68,.12)", tintRB:"rgba(239,68,68,.25)",
  tintN:"rgba(59,130,246,.12)", tintNB:"rgba(59,130,246,.28)",
};
const LIGHT = {
  bg:"#e2e8f0", bg2:"#edf1f7", bg3:"#d4dce8", card:"#f8fafc",
  ink:"#0f172a", ink2:"#4a5568", ink3:"#94a3b8",
  border:"rgba(15,23,42,0.09)", navy:"#3b82f6",
  g:"#16a34a", r:"#dc2626", a:"#c2410c",
  tintG:"rgba(34,197,94,.10)", tintGB:"rgba(34,197,94,.35)",
  tintR:"rgba(239,68,68,.10)", tintRB:"rgba(239,68,68,.35)",
  tintN:"rgba(59,130,246,.10)", tintNB:"rgba(59,130,246,.35)",
};
type Theme = typeof DARK;

/* ─── Nav ─── */
const NAV = [
  { id:"overview",    label:"Vue d'ensemble" },
  { id:"checkin",     label:"Check-in" },
  { id:"trades",      label:"Log de trades" },
  { id:"rapport",     label:"Rapport hebdo" },
  { id:"journal",     label:"Journal" },
  { id:"confluences", label:"Confluences" },
  { id:"settings",    label:"Paramètres" },
];
function NavIcon({ id }: { id: string }) {
  if (id==="overview")    return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (id==="checkin")     return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>;
  if (id==="trades")      return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
  if (id==="rapport")     return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
  if (id==="journal")     return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
  if (id==="confluences") return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
  if (id==="settings")    return <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
  return null;
}

/* ─── Timeline (x,y en % de la fenêtre complète) ─── */
/* Sidebar: 180px / 960px = 18.75% de large
   Chrome:  36px  / 520px = 6.9% de haut
   Nav items (centre Y depuis haut fenêtre):
     Vue d'ensemble : ~18%    Check-in: ~22%
     Log de trades  : ~26%    Rapport  : ~30%
     Paramètres     : ~40%
*/
type KF = { t:number; x:number; y:number; click?:true; screen?:string };
const TL: KF[] = [
  { t:0,     x:9.5, y:18 },
  { t:800,   x:9.5, y:18,  click:true, screen:"overview" },
  { t:1700,  x:58,  y:17 },
  { t:2700,  x:27,  y:56 },
  { t:3600,  x:60,  y:56 },
  { t:4500,  x:9.5, y:22,  },
  { t:5200,  x:9.5, y:22,  click:true, screen:"checkin" },
  { t:6100,  x:70,  y:33 },
  { t:6800,  x:70,  y:33,  click:true },
  { t:7600,  x:70,  y:49 },
  { t:8300,  x:70,  y:49,  click:true },
  { t:9100,  x:86,  y:65 },
  { t:9800,  x:86,  y:65,  click:true },
  { t:10500, x:55,  y:86 },
  { t:11200, x:55,  y:86,  click:true },
  { t:12000, x:9.5, y:26 },
  { t:12700, x:9.5, y:26,  click:true, screen:"trades" },
  { t:13500, x:55,  y:40 },
  { t:14300, x:55,  y:52 },
  { t:15100, x:55,  y:63 },
  { t:15900, x:9.5, y:30 },
  { t:16600, x:9.5, y:30,  click:true, screen:"rapport" },
  { t:17400, x:66,  y:42 },
  { t:18400, x:50,  y:70 },
  { t:19200, x:9.5, y:40 },
  { t:19900, x:9.5, y:40,  click:true, screen:"settings" },
  { t:20800, x:55,  y:40 },
  { t:21800, x:83,  y:76,  click:true },
  { t:22600, x:9.5, y:18 },
  { t:28000, x:9.5, y:18 },
];
const CYCLE = 28000;

function getCursorState(elapsed: number): { x:number; y:number; clicking:boolean } {
  const t = elapsed % CYCLE;
  let prev = TL[0], next = TL[0];
  for (let i = 0; i < TL.length - 1; i++) {
    if (t >= TL[i].t && t <= TL[i+1].t) { prev = TL[i]; next = TL[i+1]; break; }
  }
  const range = next.t - prev.t;
  const raw = range > 0 ? (t - prev.t) / range : 1;
  const e = raw < 0.5 ? 2*raw*raw : -1+(4-2*raw)*raw;
  const clicking = !!prev.click && raw < 0.4;
  return { x: prev.x + (next.x - prev.x)*e, y: prev.y + (next.y - prev.y)*e, clicking };
}


/* ══════════════ ÉCRANS ══════════════ */

function OverviewScreen({ elapsed, T }: { elapsed:number; T:Theme }) {
  const e = elapsed;
  const s1 = e>600, s2 = e>1600, s3 = e>2800, s4 = e>3800;
  const scores = [68,72,0,82,78,85,82], days=["LU","MA","ME","JE","VE","SA","DI"];
  return (
    <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:11, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div style={{ opacity:s1?1:0, transform:s1?"none":"translateY(6px)", transition:"all .5s", background:T.tintG, border:`1.5px solid ${T.tintGB}`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:18 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:7, flexShrink:0 }}>
          {(["GO","CAUTION","STOP"] as const).map(l=>(
            <div key={l} style={{ width:12, height:12, borderRadius:"50%", background:l==="GO"?"#34c45a":"rgba(128,128,128,.15)", boxShadow:l==="GO"?"0 0 9px rgba(52,196,90,.85)":"none" }}/>
          ))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.g, textTransform:"uppercase", letterSpacing:".14em", marginBottom:4 }}>Signal de session</div>
          <div style={{ fontSize:16, fontWeight:800, color:T.g, marginBottom:4 }}>État mental optimal</div>
          <div style={{ fontSize:12, color:T.ink3, lineHeight:1.55 }}>Bonne condition pour opérer. Applique ton plan avec discipline.</div>
        </div>
        <div style={{ flexShrink:0, textAlign:"center", background:T.tintG, border:`1px solid ${T.tintGB}`, borderRadius:10, padding:"14px 18px" }}>
          <div style={{ fontSize:22, marginBottom:6 }}>✓</div>
          <div style={{ fontSize:11, fontWeight:700, color:T.g }}>Tu peux trader</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:9, opacity:s2?1:0, transform:s2?"none":"translateY(6px)", transition:"all .5s .1s" }}>
        {[{l:"Score mental",v:"82",s:"État optimal",c:T.g},{l:"Win rate",v:"68%",s:"9W · 4L · 7j",c:T.g},{l:"P&L net",v:"+620€",s:"Cette semaine",c:T.g},{l:"Profit factor",v:"2.1",s:"Stratégie rentable",c:T.g}].map(m=>(
          <div key={m.l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 15px" }}>
            <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:7 }}>{m.l}</div>
            <div style={{ fontFamily:"var(--font-fraunces)", fontSize:28, fontWeight:700, color:m.c, lineHeight:1, marginBottom:3 }}>{m.v}</div>
            <div style={{ fontSize:10, color:m.c, fontWeight:600 }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.15fr .85fr", gap:9, opacity:s3?1:0, transition:"opacity .5s .1s" }}>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 16px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Score mental — 7 jours</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:64 }}>
            {scores.map((sc,i)=>{
              const h=sc?Math.max(5,Math.round((sc/100)*58)):4;
              const c=sc>=75?T.g:sc>=60?T.a:sc?T.r:T.bg3;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
                  <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
                    <div style={{ width:"100%", height:s3?h:0, background:c, borderRadius:4, transition:`height .55s ease ${i*.07}s`, outline:i===6?`2px solid ${c}`:"none", outlineOffset:2 }}/>
                  </div>
                  <div style={{ fontSize:8, color:i===6?T.ink:T.ink3, fontWeight:i===6?700:400 }}>{days[i]}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:9, paddingTop:9, borderTop:`1px solid ${T.border}`, fontSize:10, color:T.ink3, display:"flex", gap:5 }}>
            <span style={{ color:T.g, fontWeight:700 }}>↑ +4 pts</span><span>par rapport à hier</span>
          </div>
        </div>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 16px", display:"flex", flexDirection:"column", gap:9 }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em" }}>Objectif du jour</div>
          <div style={{ fontSize:12, color:T.ink2, lineHeight:1.6, flex:1 }}>Conditions optimales. Reste dans ton plan, applique tes critères sans les assouplir.</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 10px", background:T.bg2, borderRadius:8, border:`1px solid ${T.border}` }}>
            <span style={{ fontSize:13 }}>🔥</span><span style={{ fontSize:11, fontWeight:700, color:T.a }}>14 jours de streak</span>
          </div>
        </div>
      </div>
      <div style={{ opacity:s4?1:0, transition:"opacity .4s", background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"12px 16px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:9 }}>Derniers trades</div>
        {[{pair:"EUR/USD",dir:"Long",pnl:"+85€",win:true},{pair:"GBP/JPY",dir:"Long",pnl:"+140€",win:true},{pair:"NAS100",dir:"Short",pnl:"−60€",win:false}].map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:t.win?T.g:T.r, flexShrink:0 }}/>
            <span style={{ fontSize:12, fontWeight:600, color:T.ink, flex:1 }}>{t.pair}</span>
            <span style={{ fontSize:11, color:T.ink3 }}>{t.dir}</span>
            <span style={{ fontSize:12, fontWeight:700, color:t.win?T.g:T.r }}>{t.pnl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const QS=[
  { label:"Sommeil",       q:"Combien d'heures as-tu dormi ?",           opts:["💀 <5h","😴 5-6h","😐 6-7h","😊 7-8h","⚡ 8h+"],            sel:3 },
  { label:"Énergie",       q:"Comment te sens-tu physiquement ?",         opts:["😴 Épuisé","😪 Fatigué","😐 Neutre","😊 Bien","⚡ Excellent"],  sel:3 },
  { label:"Concentration", q:"Ta capacité à te concentrer aujourd'hui ?", opts:["😵 Nulle","🤔 Faible","😐 Correcte","🎯 Bonne","🧠 Optimale"],  sel:4 },
];

function CheckinScreen({ elapsed, T }: { elapsed:number; T:Theme }) {
  const step = elapsed<1600?0:elapsed<3100?1:2;
  const c1=elapsed>1500, c2=elapsed>3000, c3=elapsed>4500;
  return (
    <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14, height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", gap:5 }}>
        {QS.map((_,i)=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=step?T.navy:T.bg3, transition:"background .4s" }}/>)}
        <div style={{ flex:1, height:3, borderRadius:2, background:T.bg3 }}/>
        <div style={{ flex:1, height:3, borderRadius:2, background:T.bg3 }}/>
      </div>
      {QS.map((q,qi)=>(
        <div key={qi} style={{ opacity:step===qi?1:step>qi?0.28:0, transform:step===qi?"none":step>qi?"translateY(-4px)":"translateY(8px)", transition:"all .4s", display:step<qi?"none":"block" }}>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>{q.label}</div>
          <div style={{ fontSize:14, fontWeight:600, color:T.ink, marginBottom:12 }}>{q.q}</div>
          <div style={{ display:"flex", gap:7 }}>
            {q.opts.map((o,oi)=>{
              const sel=(qi===0&&c1&&oi===q.sel)||(qi===1&&c2&&oi===q.sel)||(qi===2&&c3&&oi===q.sel);
              return <div key={oi} style={{ flex:1, padding:"9px 4px", borderRadius:9, background:sel?T.tintN:T.bg2, border:`1px solid ${sel?T.navy:T.border}`, textAlign:"center", fontSize:10, color:sel?"#93c5fd":T.ink3, fontWeight:sel?700:400, transition:"all .25s", lineHeight:1.4 }}>{o}</div>;
            })}
          </div>
        </div>
      ))}
      <div style={{ marginTop:"auto", opacity:step>=2?1:0, transition:"opacity .4s .2s" }}>
        <div style={{ background:T.navy, borderRadius:9, padding:"12px", textAlign:"center", fontSize:14, fontWeight:700, color:"#fff" }}>Voir mon score →</div>
      </div>
    </div>
  );
}

function ScoreScreen({ elapsed, T }: { elapsed:number; T:Theme }) {
  const score=Math.min(82, Math.round(elapsed/3500*82*1.5));
  const s1=elapsed>800, s2=elapsed>1600, s3=elapsed>2400;
  return (
    <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18, height:"100%", boxSizing:"border-box" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:12 }}>Score mental du jour</div>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:6 }}>
          <span style={{ fontFamily:"var(--font-fraunces)", fontSize:80, fontWeight:700, color:score>=75?T.g:score>=60?T.a:T.r, lineHeight:1, transition:"color .3s" }}>{score}</span>
          <span style={{ fontSize:18, color:T.ink3 }}>/100</span>
        </div>
      </div>
      <div style={{ opacity:s1?1:0, transform:s1?"none":"translateY(8px)", transition:"all .5s", display:"inline-flex", alignItems:"center", gap:8, background:T.tintG, border:`1px solid ${T.tintGB}`, borderRadius:20, padding:"8px 20px" }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:T.g }}/>
        <span style={{ fontSize:13, fontWeight:700, color:T.g }}>État optimal · Tu peux trader</span>
      </div>
      <div style={{ opacity:s2?1:0, transition:"opacity .5s", maxWidth:340, textAlign:"center", fontSize:13, color:T.ink3, lineHeight:1.65 }}>
        Bonne condition pour opérer. Applique ton plan avec discipline — la sur-confiance est le risque principal dans cet état.
      </div>
      <div style={{ display:"flex", gap:10, opacity:s3?1:0, transition:"opacity .5s .1s" }}>
        {[{l:"Sommeil",v:"7-8h",i:"😊"},{l:"Énergie",v:"Bien",i:"😊"},{l:"Focus",v:"Optimal",i:"🧠"},{l:"Stress",v:"Léger",i:"🙂"}].map(m=>(
          <div key={m.l} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px", textAlign:"center" }}>
            <div style={{ fontSize:15, marginBottom:4 }}>{m.i}</div>
            <div style={{ fontSize:9, color:T.ink3, marginBottom:3 }}>{m.l}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink }}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TROWS=[
  {pair:"EUR/USD",dir:"Long", emotion:"Calme",    res:"Gagnant", pnl:"+85€",  score:82,win:true},
  {pair:"GBP/JPY",dir:"Long", emotion:"Confiant", res:"Gagnant", pnl:"+140€", score:78,win:true},
  {pair:"NAS100", dir:"Short",emotion:"Anxieux",  res:"Perdant", pnl:"−60€",  score:55,win:false},
  {pair:"BTC/USD",dir:"Long", emotion:"Impatient",res:"Perdant", pnl:"−35€",  score:62,win:false},
];
function TradesScreen({ elapsed, T }: { elapsed:number; T:Theme }) {
  const vis=Math.floor(elapsed/700);
  const showI=elapsed>3200;
  return (
    <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:10, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:3 }}>Log de trades</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>Historique · Avril 2026</div>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          {[{l:"Win rate",v:"50%",c:T.a},{l:"P&L",v:"+130€",c:T.g}].map(s=>(
            <div key={s.l} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
              <div style={{ fontSize:9, color:T.ink3, marginBottom:2 }}>{s.l}</div>
              <div style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr .8fr .9fr .7fr 1.1fr", gap:0, padding:"0 2px", borderBottom:`1px solid ${T.border}`, paddingBottom:7 }}>
        {["Paire","Direction","Résultat","P&L","Score mental"].map(h=>(
          <div key={h} style={{ fontSize:8, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em" }}>{h}</div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
        {TROWS.map((r,i)=>(
          <div key={i} style={{ opacity:i<vis?1:0, transform:i<vis?"translateX(0)":"translateX(-12px)", transition:`all .4s ease ${i*.09}s`, display:"grid", gridTemplateColumns:"1fr .8fr .9fr .7fr 1.1fr", alignItems:"center", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px" }}>
            <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{r.pair}</span>
            <span style={{ fontSize:12, fontWeight:600, color:r.dir==="Long"?T.g:T.r }}>{r.dir}</span>
            <span style={{ fontSize:12, fontWeight:600, color:r.win?T.g:T.r }}>{r.res}</span>
            <span style={{ fontSize:13, fontWeight:700, color:r.win?T.g:T.r }}>{r.pnl}</span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ flex:1, height:3, background:T.bg3, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${r.score}%`, background:r.score>=75?T.g:r.score>=60?T.a:T.r, borderRadius:2 }}/>
              </div>
              <span style={{ fontSize:10, color:T.ink3, flexShrink:0 }}>{r.score}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ opacity:showI?1:0, transform:showI?"none":"translateY(6px)", transition:"all .4s", background:T.tintR, border:`1px solid ${T.tintRB}`, borderRadius:10, padding:"10px 14px", display:"flex", gap:9 }}>
        <span style={{ fontSize:13, flexShrink:0 }}>⚠️</span>
        <span style={{ fontSize:12, color:T.ink2, lineHeight:1.55 }}>Tes 2 derniers perdants pris en état <strong style={{ color:T.r }}>Anxieux / Impatient</strong>. Évalue ton état avant chaque entrée.</span>
      </div>
    </div>
  );
}

const WBARS=[{day:"LUN",pnl:85,win:true},{day:"MAR",pnl:140,win:true},{day:"MER",pnl:-60,win:false},{day:"JEU",pnl:220,win:true},{day:"VEN",pnl:60,win:true}];
function RapportScreen({ elapsed, T }: { elapsed:number; T:Theme }) {
  const s1=elapsed>400, s2=elapsed>1800, s3=elapsed>2800;
  return (
    <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:11, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:3 }}>Rapport hebdomadaire</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>Semaine du 14 avril</div>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          {[{l:"P&L",v:"+445€",c:T.g},{l:"Win rate",v:"80%",c:T.g},{l:"Score moy.",v:"75",c:T.g}].map(s=>(
            <div key={s.l} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
              <div style={{ fontSize:9, color:T.ink3, marginBottom:2 }}>{s.l}</div>
              <div style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 16px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>P&L par jour</div>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:70 }}>
          {WBARS.map((b,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", height:62, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                <div style={{ width:"100%", height:s1?`${(Math.abs(b.pnl)/220)*58}px`:"0px", background:b.win?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)", border:`1px solid ${b.win?T.tintGB:T.tintRB}`, borderRadius:6, transition:`height .6s ease ${i*.09}s` }}/>
              </div>
              <div style={{ fontSize:9, color:T.ink3, fontWeight:600 }}>{b.day}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, opacity:s3?1:0, transition:"opacity .4s" }}>
        {[{t:"Meilleur état (≥75)",d:"4j · +445€ · WR 80%",c:T.g,bg:T.tintG,bd:T.tintGB},{t:"Dégradé (<60)",d:"1j · −60€ · WR 0%",c:T.r,bg:T.tintR,bd:T.tintRB}].map(c=>(
          <div key={c.t} style={{ background:c.bg, border:`1px solid ${c.bd}`, borderRadius:9, padding:"11px 13px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:c.c, marginBottom:4 }}>{c.t}</div>
            <div style={{ fontSize:11, color:T.ink2 }}>{c.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7, opacity:s2?1:0, transform:s2?"none":"translateY(6px)", transition:"all .5s" }}>
        {[{i:"📈",t:"Tes meilleures sessions coïncident avec un score ≥ 78.",c:T.tintG,b:T.tintGB},{i:"🔴",t:"Mercredi (score 55) : −60€. Évite de trader sous 60.",c:T.tintR,b:T.tintRB}].map((ins,i)=>(
          <div key={i} style={{ background:ins.c, border:`1px solid ${ins.b}`, borderRadius:9, padding:"9px 13px", display:"flex", gap:8 }}>
            <span style={{ fontSize:13, flexShrink:0 }}>{ins.i}</span>
            <span style={{ fontSize:12, color:T.ink2, lineHeight:1.55 }}>{ins.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ elapsed, T }: { elapsed:number; T:Theme }) {
  const s1=elapsed>300, s2=elapsed>1200, s3=elapsed>2100;
  return (
    <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:11, height:"100%", boxSizing:"border-box", overflow:"hidden" }}>
      <div>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".12em", marginBottom:3 }}>Paramètres</div>
        <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>Mon compte</div>
      </div>
      <div style={{ opacity:s1?1:0, transform:s1?"none":"translateY(6px)", transition:"all .4s", background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 16px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:11 }}>Profil</div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {[{l:"Prénom affiché",v:"Thomas"},{l:"Email",v:"thomas@gmail.com"}].map(f=>(
            <div key={f.l}>
              <div style={{ fontSize:10, fontWeight:600, color:T.ink2, marginBottom:5 }}>{f.l}</div>
              <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:7, padding:"9px 13px", fontSize:13, color:T.ink }}>{f.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ opacity:s2?1:0, transform:s2?"none":"translateY(6px)", transition:"all .4s .05s", background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 16px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:11 }}>Trading</div>
        <div>
          <div style={{ fontSize:10, fontWeight:600, color:T.ink2, marginBottom:5 }}>Capital de trading</div>
          <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:7, padding:"9px 13px", fontSize:13, color:T.ink }}>10 000 €</div>
          <div style={{ fontSize:10, color:T.ink3, marginTop:5 }}>Permet de calculer le % de P&L automatiquement.</div>
        </div>
      </div>
      <div style={{ opacity:s3?1:0, transform:s3?"none":"translateY(6px)", transition:"all .4s .1s", background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"14px 16px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:11 }}>Apparence</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:3 }}>Thème sombre</div>
            <div style={{ fontSize:11, color:T.ink3 }}>Disponible en clair et en sombre</div>
          </div>
          <div style={{ width:42, height:24, borderRadius:12, background:T.navy, display:"flex", alignItems:"center", padding:"0 3px", justifyContent:"flex-end", cursor:"pointer" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ COMPOSANT PRINCIPAL ══════════════ */
export default function ProductTour() {

  const [darkDemo, setDarkDemo]     = useState(true);
  const [cursorX, setCursorX]       = useState(9.5);
  const [cursorY, setCursorY]       = useState(18);
  const [clicking, setClicking]     = useState(false);
  const [screen, setScreen]         = useState("overview");
  const [screenElapsed, setScreenElapsed] = useState(0);
  const [fading, setFading]         = useState(false);
  const startRef  = useRef<number | null>(null);
  const rafRef    = useRef<number>(0);
  const lastScreen= useRef("overview");
  const screenStartRef = useRef(0);
  const lastClickRef= useRef(-1);

  const T = darkDemo ? DARK : LIGHT;

  useEffect(() => {
    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const el = (ts - startRef.current) % CYCLE;
      // cursor
      const cur = getCursorState(el);
      setCursorX(cur.x);
      setCursorY(cur.y);

      // detect clicks
      const t = el;
      const clickKF = TL.find(k => k.click && Math.abs(k.t - t) < 50);
      if (clickKF && clickKF.t !== lastClickRef.current) {
        lastClickRef.current = clickKF.t;
        setClicking(true);
        setTimeout(() => setClicking(false), 420);
        if (clickKF.screen) {
          const ns = clickKF.screen;
          setFading(true);
          setTimeout(() => {
            setScreen(ns);
            lastScreen.current = ns;
            screenStartRef.current = Date.now();
            setFading(false);
          }, 300);
        }
      }

      // screen elapsed
      setScreenElapsed(Date.now() - screenStartRef.current);

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const activeNav = ["checkin","score"].includes(screen) ? "checkin" : screen;

  return (
    <section id="produit" style={{ padding:"120px 5%", background:"#0a0f1a", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"25%", left:"50%", transform:"translateX(-50%)", width:1000, height:600, background:"radial-gradient(ellipse, rgba(15,39,68,.8) 0%, transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:960, margin:"0 auto", position:"relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".14em", marginBottom:14 }}>Le produit</div>
          <h2 style={{ fontFamily:"var(--font-fraunces)", fontSize:"clamp(32px,4vw,54px)", fontWeight:700, lineHeight:1.08, letterSpacing:"-.025em", color:"#fff", marginBottom:14 }}>
            Ton copilote mental.<br/>
            <span style={{ color:"rgba(255,255,255,.35)" }}>Ouvert avant chaque session.</span>
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.4)", maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>
            Un dashboard conçu pour te rendre plus discipliné — pas plus occupé.
          </p>
        </div>

        {/* Toggle thème */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
          <button onClick={()=>setDarkDemo(d=>!d)} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:20, padding:"7px 16px", cursor:"pointer", transition:"all .2s" }}>
            <span style={{ fontSize:13 }}>{darkDemo?"☀️":"🌙"}</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,.5)", fontWeight:600 }}>{darkDemo?"Voir en thème clair":"Voir en thème sombre"}</span>
          </button>
        </div>

        {/* Fenêtre */}
        <div style={{ borderRadius:16, overflow:"hidden", border:`1px solid rgba(255,255,255,.09)`, boxShadow:"0 0 0 1px rgba(255,255,255,.04), 0 56px 140px rgba(0,0,0,.8)", background:T.bg, position:"relative" }}>

          {/* Chrome */}
          <div style={{ height:36, background:darkDemo?"rgba(255,255,255,.03)":T.card, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 14px", gap:9 }}>
            <div style={{ display:"flex", gap:5 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i)=><div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c, opacity:.5 }}/>)}
            </div>
            <div style={{ flex:1, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:5, height:20, display:"flex", alignItems:"center", justifyContent:"center", maxWidth:260, margin:"0 auto" }}>
              <span style={{ fontSize:9, color:T.ink3, letterSpacing:".02em" }}>mindtrade.co/dashboard</span>
            </div>
          </div>

          {/* Layout */}
          <div style={{ display:"flex", height:484 }}>

            {/* Sidebar */}
            <div style={{ width:180, background:T.card, borderRight:`1px solid ${T.border}`, padding:"10px 7px", display:"flex", flexDirection:"column", flexShrink:0, zIndex:2 }}>
              <div style={{ padding:"4px 8px 11px", borderBottom:`1px solid ${T.border}`, marginBottom:8 }}>
                <span style={{ fontFamily:"var(--font-montserrat)", fontSize:13, fontWeight:900, color:T.ink, letterSpacing:"-.3px" }}>MindTrade</span>
              </div>
              <nav style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
                {NAV.map(n=>{
                  const active=n.id===activeNav;
                  return (
                    <div key={n.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 9px", borderRadius:7, background:active?T.bg2:"transparent", border:`1px solid ${active?T.border:"transparent"}`, color:active?T.ink:T.ink3, fontSize:11.5, fontWeight:active?600:500, transition:"all .2s" }}>
                      <span style={{ opacity:active?1:.5, flexShrink:0 }}><NavIcon id={n.id}/></span>
                      {n.label}
                    </div>
                  );
                })}
              </nav>
              <div style={{ marginTop:10, borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
                <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, padding:"11px 12px" }}>
                  <div style={{ fontSize:9, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>Score mental</div>
                  <div style={{ fontFamily:"var(--font-fraunces)", fontSize:26, fontWeight:700, color:T.g, lineHeight:1, marginBottom:2 }}>82</div>
                  <div style={{ fontSize:10, color:T.g, fontWeight:600, marginBottom:6 }}>État optimal</div>
                  <div style={{ height:3, background:T.bg3, borderRadius:2 }}>
                    <div style={{ height:"100%", width:"82%", background:T.g, borderRadius:2 }}/>
                  </div>
                  <div style={{ fontSize:10, color:T.ink3, marginTop:5 }}>🔥 14j de streak</div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div style={{ flex:1, overflow:"hidden", opacity:fading?0:1, transition:"opacity .28s ease", background:T.bg }}>
              {screen==="overview"  && <OverviewScreen elapsed={screenElapsed} T={T}/>}
              {screen==="checkin"   && <CheckinScreen  elapsed={screenElapsed} T={T}/>}
              {screen==="score"     && <ScoreScreen    elapsed={screenElapsed} T={T}/>}
              {screen==="trades"    && <TradesScreen   elapsed={screenElapsed} T={T}/>}
              {screen==="rapport"   && <RapportScreen  elapsed={screenElapsed} T={T}/>}
              {screen==="settings"  && <SettingsScreen elapsed={screenElapsed} T={T}/>}
            </div>
          </div>

          {/* Curseur Windows */}
          <div style={{ position:"absolute", left:`${cursorX}%`, top:`${cursorY}%`, pointerEvents:"none", zIndex:30, transition:"left .55s cubic-bezier(.25,.46,.45,.94), top .55s cubic-bezier(.25,.46,.45,.94)", transform:"translate(-2px,-2px)" }}>
            {clicking && (
              <div style={{ position:"absolute", width:28, height:28, borderRadius:"50%", border:"2px solid rgba(255,255,255,.7)", top:-10, left:-10, animation:"ripple .45s ease-out forwards", pointerEvents:"none" }}/>
            )}
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L2 20L6.5 15.5L9.5 22.5L12 21.5L9 14.5L15 14.5L2 2Z" fill="white" stroke="#222" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Légende */}
        <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:32, flexWrap:"wrap" }}>
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
          from { opacity:1; transform:scale(0.4); }
          to   { opacity:0; transform:scale(2.5); }
        }
      `}</style>
    </section>
  );
}
