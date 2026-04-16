"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const links = [
  ["#pourquoi", "Pourquoi"],
  ["#fonctionnalites", "Comment ça marche"],
  ["#acces", "Tarifs"],
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 37, left: 0, right: 0, zIndex: 100,
        padding: "0 5%", height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(250,250,248,.94)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <a href="/" style={{ fontFamily: "var(--font-montserrat)", fontSize: 15, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.4px", textDecoration: "none" }}>
          MindTrade
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-desktop">
          {links.map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 13, fontWeight: 500, color: "var(--ink2)", textDecoration: "none", transition: "color .15s" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--ink2)")}>
              {label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="#diagnostic" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", textDecoration: "none", padding: "8px 16px", borderRadius: 6, border: "1.5px solid rgba(15,39,68,.15)", background: "rgba(15,39,68,.04)" }}>
            Diagnostic gratuit
          </a>
          {isLoggedIn ? (
            <a href="/dashboard" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", textDecoration: "none" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--navy)")}>
              Mon dashboard →
            </a>
          ) : (
            <a href="/login" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink2)", textDecoration: "none" }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--ink)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--ink2)")}>
              Connexion
            </a>
          )}
          <a href="#acces" style={{
            background: "var(--ink)", color: "#fff", padding: "9px 22px", borderRadius: 6,
            fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)",
          }}>
            Commencer →
          </a>
          {/* Hamburger mobile */}
          <button onClick={() => setMobileOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }} className="nav-hamburger">
            <div style={{ width: 20, height: 2, background: "var(--ink)", marginBottom: 4, borderRadius: 1 }} />
            <div style={{ width: 20, height: 2, background: "var(--ink)", marginBottom: 4, borderRadius: 1 }} />
            <div style={{ width: 20, height: 2, background: "var(--ink)", borderRadius: 1 }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "rgba(250,250,248,.98)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)", padding: "16px 5% 24px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              {label}
            </a>
          ))}
          <a href="#acces" onClick={() => setMobileOpen(false)} style={{ marginTop: 12, background: "var(--ink)", color: "#fff", padding: "13px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
            Commencer →
          </a>
        </div>
      )}
    </>
  );
}
