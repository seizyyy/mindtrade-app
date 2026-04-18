"use client";

export default function ProductTour() {
  return (
    <section id="produit" style={{ padding: "120px 5%", background: "#0a0f1a", position: "relative", overflow: "hidden" }}>
      {/* Glows */}
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:1000, height:600, background:"radial-gradient(ellipse, rgba(15,39,68,.75) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, right:"10%", width:400, height:400, background:"radial-gradient(circle, rgba(59,130,246,.06) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>

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

        {/* Screenshot */}
        <div style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.09)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.04), 0 48px 140px rgba(0,0,0,.8)",
          background: "#0d1424",
          position: "relative",
        }}>
          {/* Chrome bar */}
          <div style={{ height:34, background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", padding:"0 14px", gap:9, flexShrink:0 }}>
            <div style={{ display:"flex", gap:5 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i) => <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c, opacity:.45 }}/>)}
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:5, height:19, display:"flex", alignItems:"center", justifyContent:"center", maxWidth:240, margin:"0 auto" }}>
              <span style={{ fontSize:9, color:"rgba(255,255,255,.25)" }}>mindtrade.co/dashboard</span>
            </div>
          </div>
          <img
            src="/dashboard-preview.png"
            alt="MindTrade Dashboard"
            style={{ width:"100%", display:"block" }}
          />
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
