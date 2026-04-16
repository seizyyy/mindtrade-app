"use client";

import { useState, useEffect } from "react";

export default function UrgencyBar() {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Deadline: 48h from first visit, stored in localStorage
    const stored = localStorage.getItem("mt_urgency_deadline");
    let deadline: number;
    if (stored) {
      deadline = parseInt(stored);
    } else {
      deadline = Date.now() + 48 * 60 * 60 * 1000;
      localStorage.setItem("mt_urgency_deadline", String(deadline));
    }

    function tick() {
      const diff = deadline - Date.now();
      if (diff <= 0) { setVisible(false); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 150,
      background: "linear-gradient(90deg, var(--navy) 0%, #1a3a5c 100%)",
      borderBottom: "1px solid rgba(255,255,255,.08)",
      padding: "9px 5%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Offre Lifetime à −50% — expire dans</span>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { val: pad(timeLeft.h), label: "h" },
            { val: pad(timeLeft.m), label: "min" },
            { val: pad(timeLeft.s), label: "sec" },
          ].map(({ val, label }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 4, padding: "2px 7px", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "var(--font-outfit)", minWidth: 28, textAlign: "center" }}>{val}</div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{label}</span>
              {i < 2 && <span style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginLeft: 2 }}>·</span>}
            </div>
          ))}
        </div>
        <a href="#acces" style={{ background: "var(--gold)", color: "#fff", padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>
          En profiter →
        </a>
      </div>
      <button onClick={() => setVisible(false)} style={{ position: "absolute", right: "2%", background: "none", border: "none", color: "rgba(255,255,255,.4)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}
