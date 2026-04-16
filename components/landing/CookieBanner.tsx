"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("mt_cookies");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("mt_cookies", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 500, width: "calc(100% - 48px)", maxWidth: 640,
      background: "var(--ink)", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 12, padding: "16px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      boxShadow: "0 8px 40px rgba(0,0,0,.4)",
      flexWrap: "wrap",
    }}>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.5, margin: 0, flex: 1 }}>
        MindTrade utilise uniquement des cookies fonctionnels nécessaires à votre session. Aucun tracking publicitaire.{" "}
        <a href="/confidentialite" style={{ color: "rgba(255,255,255,.45)", textDecoration: "underline" }}>En savoir plus</a>
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={accept} style={{ background: "#fff", color: "var(--ink)", border: "none", borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          Accepter
        </button>
        <button onClick={accept} style={{ background: "transparent", color: "rgba(255,255,255,.4)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 6, padding: "8px 16px", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          Refuser
        </button>
      </div>
    </div>
  );
}
