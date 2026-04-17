"use client";

import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration: number, start: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

export default function ProductTour() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const score   = useCountUp(82, 1800, started);
  const winRate = useCountUp(75, 2200, started);
  const pnl     = useCountUp(7340, 2600, started);
  const pf      = useCountUp(363, 2400, started);

  const signalVisible = started && score > 60;

  return (
    <section id="produit" ref={ref} style={{ padding: "120px 5%", background: "#0a0f1a", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:1000, height:600, background:"radial-gradient(ellipse, rgba(15,39,68,.75) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, right:"10%", width:400, height:400, background:"radial-gradient(circle, rgba(59,130,246,.06) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom: 56 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".14em", marginBottom:14 }}>Le produit</div>
          <h2 style={{ fontFamily:"var(--font-fraunces)", fontSize:"clamp(32px,4vw,54px)", fontWeight:700, lineHeight:1.08, letterSpacing:"-.025em", color:"#fff", marginBottom:16 }}>
            Ton copilote mental.<br/>
            <span style={{ color:"rgba(255,255,255,.35)" }}>Ouvert avant chaque session.</span>
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.4)", maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>
            Un dashboard conçu pour te rendre plus discipliné — pas plus occupé.
          </p>
        </div>

        {/* Dashboard animé */}
        <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,.09)", boxShadow:"0 0 0 1px rgba(255,255,255,.04), 0 48px 140px rgba(0,0,0,.8)", background:"#0d1424", position:"relative" }}>

          {/* Chrome bar */}
          <div style={{ height:34, background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", padding:"0 14px", gap:9 }}>
            <div style={{ display:"flex", gap:5 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i) => <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c, opacity:.45 }}/>)}
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:5, height:19, display:"flex", alignItems:"center", justifyContent:"center", maxWidth:240, margin:"0 auto" }}>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.25)" }}>mindtrade.co/dashboard</span>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding:"28px 32px 32px", display:"flex", flexDirection:"column", gap:16 }}>

            {/* Signal de session */}
            <div style={{ borderRadius:12, padding:"16px 20px", background: signalVisible ? "rgba(34,197,94,.08)" : "rgba(255,255,255,.03)", border:`1px solid ${signalVisible ? "rgba(34,197,94,.25)" : "rgba(255,255,255,.06)"}`, transition:"all .6s ease", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: signalVisible && i === 0 ? "#22c55e" : "rgba(255,255,255,.1)", transition:"background .4s", transitionDelay:`${i * 0.2}s` }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>Signal de session</div>
                <div style={{ fontSize:18, fontWeight:700, color: signalVisible ? "#22c55e" : "rgba(255,255,255,.2)", transition:"color .6s" }}>
                  {signalVisible ? "État mental optimal" : "En attente du check-in..."}
                </div>
              </div>
            </div>

            {/* 4 métriques */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
              {/* Score */}
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"20px 18px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Score mental</div>
                <div style={{ fontFamily:"var(--font-fraunces)", fontSize:44, fontWeight:700, lineHeight:1, color: score >= 75 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444" }}>
                  {score}
                </div>
                <div style={{ height:3, background:"rgba(255,255,255,.08)", borderRadius:2, marginTop:10 }}>
                  <div style={{ height:"100%", width:`${score}%`, background:"#22c55e", borderRadius:2, transition:"width .1s" }} />
                </div>
              </div>

              {/* Win rate */}
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"20px 18px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Win rate</div>
                <div style={{ fontFamily:"var(--font-fraunces)", fontSize:44, fontWeight:700, lineHeight:1, color:"#22c55e" }}>
                  {winRate}%
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", marginTop:10 }}>7 derniers jours</div>
              </div>

              {/* P&L */}
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"20px 18px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>P&L net</div>
                <div style={{ fontFamily:"var(--font-fraunces)", fontSize:44, fontWeight:700, lineHeight:1, color:"#22c55e" }}>
                  +{pnl.toLocaleString("fr-FR")}€
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", marginTop:10 }}>Ce mois</div>
              </div>

              {/* Profit factor */}
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"20px 18px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>Profit factor</div>
                <div style={{ fontFamily:"var(--font-fraunces)", fontSize:44, fontWeight:700, lineHeight:1, color:"#22c55e" }}>
                  {(pf / 100).toFixed(2)}
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", marginTop:10 }}>Stratégie rentable</div>
              </div>
            </div>

            {/* Barre trades récents */}
            <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:"14px 18px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.25)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Derniers trades</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { pair:"XAU/USD", emotion:"Confiant", pnl:"+1 120€", color:"#22c55e" },
                  { pair:"EUR/USD", emotion:"Calme",    pnl:"+704€",   color:"#22c55e" },
                  { pair:"US30",    emotion:"Anxieux",  pnl:"-348€",   color:"#ef4444" },
                  { pair:"GBP/USD", emotion:"Calme",    pnl:"+544€",   color:"#22c55e" },
                ].map((t, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, opacity: started ? 1 : 0, transform: started ? "none" : "translateY(8px)", transition:`opacity .4s ${.8 + i * .15}s, transform .4s ${.8 + i * .15}s` }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:t.color, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:13, fontWeight:600, color:"rgba(255,255,255,.7)" }}>{t.pair}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.3)" }}>{t.emotion}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:t.color }}>{t.pnl}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Légende */}
        <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:32, flexWrap:"wrap" }}>
          {[
            { dot:"#22c55e", label:"Score mental calculé automatiquement" },
            { dot:"#f59e0b", label:"Biais détectés en temps réel" },
            { dot:"#93c5fd", label:"Performance corrélée à l'état mental" },
          ].map(a => (
            <div key={a.label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"rgba(255,255,255,.6)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:a.dot, flexShrink:0 }}/>
              {a.label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
