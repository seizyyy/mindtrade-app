"use client";

export default function AnnouncementBar() {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 101,
      background: "var(--navy)",
      padding: "10px 5%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", flexShrink: 0, animation: "pulse-dot 2s infinite" }} />
      <span style={{ fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
        Quel type de trader es-tu vraiment ?
      </span>
      <a href="#diagnostic" style={{
        fontSize: 12, fontWeight: 700, color: "#fff",
        background: "rgba(255,255,255,.15)",
        border: "1px solid rgba(255,255,255,.25)",
        borderRadius: 20, padding: "3px 14px",
        textDecoration: "none", whiteSpace: "nowrap",
        transition: "background .15s",
      }}
        onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,.25)")}
        onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,.15)")}
      >
        Diagnostic gratuit →
      </a>
    </div>
  );
}
