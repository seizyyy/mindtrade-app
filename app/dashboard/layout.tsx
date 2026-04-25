"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";

function MobileDesktopModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const dismissed = localStorage.getItem("mt-desktop-notice");
    if (isMobile && !dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem("mt-desktop-notice", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#1e293b", border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 16, padding: "32px 24px", maxWidth: 360, width: "100%", textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🖥️</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
          MindTrade est fait pour le desktop
        </div>
        <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 28 }}>
          Le dashboard complet, les graphiques et toutes les fonctionnalités sont optimisés pour ordinateur. Connecte-toi sur desktop pour une expérience complète.
        </div>
        <button onClick={dismiss} style={{
          width: "100%", padding: "13px", borderRadius: 8, border: "none",
          background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "var(--font-outfit)", marginBottom: 12,
        }}>
          J'ai compris →
        </button>
        <div style={{ fontSize: 12, color: "#475569" }}>
          mindtrade.co — accessible depuis ton navigateur desktop
        </div>
      </div>
    </div>
  );
}

const navItems: { id: string; href: string; label: string; icon: React.ReactNode; gold?: boolean }[] = [
  { id: "dashboard",    href: "/dashboard",             label: "Vue d'ensemble", icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id: "checkin",      href: "/dashboard/checkin",     label: "Check-in",       icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg> },
  { id: "trades",       href: "/dashboard/trades",      label: "Log de trades",  icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { id: "rapport",      href: "/dashboard/rapport",          label: "Rapport hebdo",    icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
  { id: "rapport-mensuel", href: "/dashboard/rapport-mensuel", label: "Rapport mensuel",  icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { id: "journal",      href: "/dashboard/journal",     label: "Journal",        icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> },
  { id: "confluences",  href: "/dashboard/confluences", label: "Confluences",    icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { id: "guide",        href: "/dashboard/guide",       label: "Guide",          icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg> },
  { id: "settings",     href: "/dashboard/settings",    label: "Paramètres",     icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  { id: "alpha",        href: "/dashboard/alpha",       label: "Alpha",          icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fbbf24" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, gold: true },
];

function getScoreColor(score: number | null) {
  if (!score) return "var(--ink3)";
  if (score >= 75) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number | null) {
  if (!score) return "Pas de check-in";
  if (score >= 75) return "Optimal";
  if (score >= 60) return "Attention";
  return "Évite de trader";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [todayScore, setTodayScore] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [dark, setDark] = useState(true);
  const supabase = createClient();

  // Charger la préférence dark mode depuis localStorage (dark par défaut)
  useEffect(() => {
    const saved = localStorage.getItem("mt-dark");
    if (saved === "0") setDark(false);
  }, []);

  // Sauvegarder la préférence
  useEffect(() => {
    localStorage.setItem("mt-dark", dark ? "1" : "0");
  }, [dark]);

  const darkVars = dark ? {
    "--bg":     "#0f172a",
    "--bg2":    "#1e293b",
    "--bg3":    "#334155",
    "--card":   "#1e293b",
    "--ink":    "#f1f5f9",
    "--ink2":   "#cbd5e1",
    "--ink3":   "#94a3b8",
    "--border": "rgba(241,245,249,0.09)",
    "--navy":   "#3b82f6",
    "--navy2":  "#2563eb",
    "--gold":   "#fbbf24",
    "--gold2":  "#f59e0b",
    "--g":      "#22c55e",
    "--r":      "#ef4444",
    "--a":      "#f59e0b",
    "--tint-r-bg":     "rgba(239,68,68,.12)",
    "--tint-r-border": "rgba(239,68,68,.25)",
    "--tint-g-bg":     "rgba(34,197,94,.10)",
    "--tint-g-border": "rgba(34,197,94,.25)",
    "--tint-n-bg":     "rgba(59,130,246,.12)",
    "--tint-n-border": "rgba(59,130,246,.28)",
    "--tint-a-bg":     "rgba(245,158,11,.12)",
    "--tint-a-border": "rgba(245,158,11,.28)",
  } as React.CSSProperties : {};

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      let { data: profile } = await supabase
        .from("profiles")
        .select("plan_active")
        .eq("id", user.id)
        .single();

      if (!profile?.plan_active) {
        // Try to verify a pending Stripe session
        const pendingSession = localStorage.getItem("mt-pending-session");
        if (pendingSession) {
          const res = await fetch("/api/stripe/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: pendingSession }),
          });
          if (res.ok) {
            localStorage.removeItem("mt-pending-session");
            const { data: updated } = await supabase
              .from("profiles")
              .select("plan_active")
              .eq("id", user.id)
              .single();
            profile = updated;
          }
        }
        if (!profile?.plan_active) { router.replace("/#acces"); return; }
      }

      const today = new Date().toISOString().split("T")[0];
      const { data: ci } = await supabase
        .from("checkins")
        .select("score")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();
      if (ci) setTodayScore(ci.score);

      const { data: cis } = await supabase
        .from("checkins")
        .select("date")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(60);
      if (cis) {
        let s = 0;
        let d = new Date();
        for (const ci of cis) {
          const expected = d.toISOString().split("T")[0];
          if (ci.date === expected) { s++; d.setDate(d.getDate() - 1); }
          else break;
        }
        setStreak(s);
      }
    }
    load();
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const activeId = navItems.find(n => n.href === pathname)?.id || "dashboard";
  const scoreColor = getScoreColor(todayScore);

  return (
    <div style={{ ...darkVars, display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)", fontFamily: "var(--font-outfit)" }}>
      {/* Mobile modal */}
      <MobileDesktopModal />
      {/* Topbar */}
      <div style={{ height: 56, background: "var(--card)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", flexShrink: 0, zIndex: 50 }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 14, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.4px" }}>MindTrade</span>
        <div style={{ fontSize: 12, color: "var(--ink3)" }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 12px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: scoreColor, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor }}>{todayScore ?? "—"}</span>
            <span style={{ fontSize: 11, color: "var(--ink3)" }}>·</span>
            <span style={{ fontSize: 11, color: "var(--ink3)" }}>{getScoreLabel(todayScore)}</span>
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", fontSize: 12, color: "var(--ink3)", cursor: "pointer", fontFamily: "var(--font-outfit)", padding: "4px 8px", borderRadius: 4 }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "var(--card)", borderRight: "1px solid var(--border)", padding: "12px 8px", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {navItems.map(item => {
              const active = activeId === item.id;
              return (
                <a key={item.id} href={item.href} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 10px", borderRadius: 7, textDecoration: "none",
                  background: active ? (item.gold ? "rgba(251,191,36,.1)" : "var(--bg2)") : "transparent",
                  border: `1px solid ${active ? (item.gold ? "rgba(251,191,36,.3)" : "var(--border)") : "transparent"}`,
                  color: item.gold ? "#fbbf24" : (active ? "var(--ink)" : "var(--ink2)"),
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  transition: "all .12s",
                }}>
                  <span style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Score widget + dark mode */}
          <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Score mental</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
                {todayScore ?? "—"}
              </div>
              <div style={{ fontSize: 11, color: scoreColor, marginTop: 3, fontWeight: 600 }}>{getScoreLabel(todayScore)}</div>
              {todayScore && (
                <div style={{ height: 3, background: "var(--bg3)", borderRadius: 2, marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${todayScore}%`, background: scoreColor, borderRadius: 2, transition: "width .3s" }} />
                </div>
              )}
              {streak > 0 && (
                <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 6 }}>🔥 {streak}j de streak</div>
              )}
              {!todayScore && (
                <a href="/dashboard/checkin" style={{ display: "block", marginTop: 8, textAlign: "center", background: "var(--navy)", color: "#fff", borderRadius: 6, padding: "6px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
                  Faire le check-in →
                </a>
              )}
            </div>

            {/* Dark mode toggle */}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px" }}>
              <a href="/?preview=1" style={{ fontSize: 12, color: "var(--ink3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                Retour au site
              </a>
              <button
                onClick={() => setDark(d => !d)}
                title={dark ? "Passer en mode clair" : "Passer en mode sombre"}
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all .2s" }}
              >
                {dark ? (
                  /* Soleil */
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--ink2)" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  /* Lune */
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--ink2)" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
                <span style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 500 }}>{dark ? "Light" : "Dark"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", position: "relative" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
