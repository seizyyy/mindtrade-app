"use client";

export default function ProductTour() {
  return (
    <section id="produit" style={{ padding: "120px 5%", background: "#0a0f1a", position: "relative", overflow: "hidden" }}>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:1000, height:600, background:"radial-gradient(ellipse, rgba(15,39,68,.75) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

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

        {/* Dashboard mockup */}
        <div className="producttour-mockup" style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,.1)", boxShadow:"0 48px 140px rgba(0,0,0,.8)", background:"#0f172a", fontSize:13 }}>

          {/* Chrome bar */}
          <div style={{ height:34, background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", padding:"0 14px", gap:9 }}>
            <div style={{ display:"flex", gap:5 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i) => <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c, opacity:.5 }}/>)}
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:5, height:19, display:"flex", alignItems:"center", justifyContent:"center", maxWidth:220, margin:"0 auto" }}>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.25)" }}>mindtrade.co/dashboard</span>
            </div>
          </div>

          {/* App layout */}
          <div className="producttour-app-layout" style={{ display:"flex", height:680 }}>

            {/* Sidebar */}
            <div className="producttour-sidebar" style={{ width:200, background:"#1e293b", borderRight:"1px solid rgba(255,255,255,.07)", padding:"12px 8px", display:"flex", flexDirection:"column", flexShrink:0 }}>
              <div style={{ fontSize:12, fontWeight:900, color:"#f1f5f9", letterSpacing:"-.4px", padding:"4px 8px", marginBottom:12 }}>MindTrade</div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {[
                  { label:"Vue d'ensemble", active:true },
                  { label:"Check-in", active:false },
                  { label:"Log de trades", active:false },
                  { label:"Rapport hebdo", active:false },
                  { label:"Journal", active:false },
                  { label:"Confluences", active:false },
                  { label:"Guide", active:false },
                  { label:"Paramètres", active:false },
                ].map(item => (
                  <div key={item.label} style={{ padding:"7px 10px", borderRadius:7, background: item.active ? "rgba(255,255,255,.08)" : "transparent", border:`1px solid ${item.active ? "rgba(255,255,255,.1)" : "transparent"}`, color: item.active ? "#f1f5f9" : "rgba(255,255,255,.45)", fontSize:12, fontWeight: item.active ? 600 : 400 }}>
                    {item.label}
                  </div>
                ))}
                <div style={{ padding:"7px 10px", borderRadius:7, background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.2)", color:"#fbbf24", fontSize:12, fontWeight:600 }}>
                  ★ Alpha
                </div>
              </div>
              <div style={{ marginTop:"auto", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"12px" }}>
                <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>Score mental</div>
                <div style={{ fontSize:26, fontWeight:700, color:"#22c55e", lineHeight:1 }}>80</div>
                <div style={{ fontSize:10, color:"#22c55e", marginTop:2, fontWeight:600 }}>Optimal</div>
                <div style={{ height:2, background:"rgba(255,255,255,.08)", borderRadius:1, marginTop:8 }}>
                  <div style={{ height:"100%", width:"80%", background:"#22c55e", borderRadius:1 }} />
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:6 }}>🔥 7j de streak</div>
              </div>
            </div>

            {/* Main */}
            <div style={{ flex:1, overflowY:"hidden", padding:"18px 20px", background:"#0f172a", display:"flex", flexDirection:"column", gap:12 }}>

              {/* Signal */}
              <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background: i===0 ? "#22c55e" : "rgba(255,255,255,.1)" }} />)}
                </div>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:3 }}>Signal de session</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#22c55e" }}>État mental optimal</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:2 }}>Bonne condition pour opérer. Applique ton plan avec discipline.</div>
                </div>
              </div>

              {/* 4 métriques */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10 }}>
                {[
                  { label:"Score mental", val:"80", sub:"État optimal", subColor:"#22c55e", valColor:"#22c55e", extra:"🔥 7j de streak" },
                  { label:"Win rate", val:"80%", sub:"4W · 1L · 7 jours", subColor:"rgba(255,255,255,.3)", valColor:"#22c55e" },
                  { label:"P&L net", val:"+2 916$", sub:"Cette semaine · 80% win", subColor:"rgba(255,255,255,.3)", valColor:"#22c55e", badge:"+5.83%" },
                  { label:"Profit factor", val:"9.38", sub:"Stratégie rentable", subColor:"rgba(255,255,255,.3)", valColor:"#22c55e" },
                ].map(m => (
                  <div key={m.label} style={{ background:"#1e293b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"14px 14px" }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>{m.label}</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:4 }}>
                      <div style={{ fontSize:28, fontWeight:700, color:m.valColor, lineHeight:1, fontFamily:"Georgia, serif" }}>{m.val}</div>
                      {m.badge && <div style={{ fontSize:10, fontWeight:700, color:"#22c55e", background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.2)", borderRadius:4, padding:"2px 6px" }}>{m.badge}</div>}
                    </div>
                    <div style={{ fontSize:10, color:m.subColor }}>{m.sub}</div>
                    {m.extra && <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:3 }}>{m.extra}</div>}
                  </div>
                ))}
              </div>

              {/* Graphique + facteur */}
              <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:10 }}>
                <div style={{ background:"#1e293b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em" }}>Score mental — 7 jours</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>Moyenne : <strong style={{ color:"#22c55e" }}>76/100</strong></div>
                  </div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
                    {[
                      { day:"DI", score:60, color:"#f59e0b" },
                      { day:"LU", score:73, color:"#22c55e" },
                      { day:"MA", score:84, color:"#22c55e" },
                      { day:"ME", score:40, color:"#ef4444" },
                      { day:"JE", score:76, color:"#22c55e" },
                      { day:"VE", score:92, color:"#22c55e" },
                      { day:"SA", score:80, color:"#22c55e" },
                    ].map(d => (
                      <div key={d.day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                        <div style={{ fontSize:9, color:d.color, fontWeight:700 }}>{d.score}</div>
                        <div style={{ width:"100%", height:`${d.score * 0.7}px`, background:d.color, borderRadius:"3px 3px 0 0", opacity:.85 }} />
                        <div style={{ fontSize:9, color:"rgba(255,255,255,.25)" }}>{d.day}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:8 }}>↓ -12 pts par rapport à hier</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ background:"#1e293b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"14px 16px", flex:1 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Facteur limitant n°1</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.5 }}>Aucun pattern négatif dominant détecté. Continue à logger tes trades.</div>
                  </div>
                  <div style={{ background:"rgba(59,130,246,.08)", border:"1px solid rgba(59,130,246,.2)", borderRadius:10, padding:"14px 16px", flex:1 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"#3b82f6", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Objectif du jour</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.5 }}>Conditions optimales. Reste dans ton plan, applique tes critères d'entrée habituels.</div>
                  </div>
                </div>
              </div>

              {/* Trades + discipline */}
              <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:10 }}>
                <div style={{ background:"#1e293b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>Derniers trades</div>
                  {[
                    { pair:"NAS100",  emotion:"Confiant", pnl:"+896$",  color:"#22c55e" },
                    { pair:"GBP/USD", emotion:"Calme",    pnl:"+544$",  color:"#22c55e" },
                    { pair:"US30",    emotion:"Anxieux",  pnl:"-348$",  color:"#ef4444" },
                    { pair:"EUR/USD", emotion:"Calme",    pnl:"+704$",  color:"#22c55e" },
                    { pair:"XAU/USD", emotion:"Confiant", pnl:"+1120$", color:"#22c55e" },
                  ].map(t => (
                    <div key={t.pair} style={{ display:"flex", alignItems:"center", gap:8, paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:t.color, flexShrink:0 }} />
                      <div style={{ flex:1, fontSize:12, fontWeight:600, color:"rgba(255,255,255,.7)" }}>{t.pair}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>{t.emotion}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:t.color }}>{t.pnl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#1e293b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:".1em" }}>Score de discipline</div>
                    <div>
                      <div style={{ fontSize:24, fontWeight:700, color:"#f59e0b", lineHeight:1, textAlign:"right", fontFamily:"Georgia, serif" }}>72</div>
                      <div style={{ fontSize:10, color:"#f59e0b", textAlign:"right" }}>À améliorer</div>
                    </div>
                  </div>
                  {[
                    { label:"Régularité check-ins", pct:35, color:"#ef4444" },
                    { label:"Règles respectées", pct:80, color:"#22c55e" },
                    { label:"Maîtrise émotionnelle", pct:100, color:"#22c55e" },
                  ].map(b => (
                    <div key={b.label} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>{b.label}</div>
                        <div style={{ fontSize:11, fontWeight:700, color:b.color }}>{b.pct}%</div>
                      </div>
                      <div style={{ height:4, background:"rgba(255,255,255,.08)", borderRadius:2 }}>
                        <div style={{ height:"100%", width:`${b.pct}%`, background:b.color, borderRadius:2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", marginTop:40 }}>
          <a href="#acces" style={{ display:"inline-block", background:"#fff", color:"#0f172a", padding:"14px 36px", borderRadius:8, fontSize:14, fontWeight:700, textDecoration:"none", fontFamily:"var(--font-outfit)", letterSpacing:"-.01em" }}>
            Commencer maintenant →
          </a>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.25)", marginTop:12 }}>Remboursé 14 jours si pas convaincu</div>
        </div>

        {/* Légende */}
        <div style={{ display:"flex", justifyContent:"center", gap:28, marginTop:32, flexWrap:"wrap" }}>
          {[
            { dot:"#22c55e", label:"Score mental calculé automatiquement" },
            { dot:"#f59e0b", label:"Biais détectés en temps réel" },
            { dot:"#93c5fd", label:"Performance corrélée à l'état mental" },
          ].map(a => (
            <div key={a.label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"rgba(255,255,255,.65)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:a.dot, flexShrink:0 }}/>
              {a.label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
