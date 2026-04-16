"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

const darkVars = {
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
} as React.CSSProperties;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const paid = searchParams.get("paid") === "1";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;
    localStorage.setItem("mt-pending-session", sessionId);
    // If already logged in, go directly to dashboard (layout will verify)
    (async () => {
      const supabaseClient = createClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) router.replace("/dashboard");
    })();
  }, [sessionId]);

  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("mt-dark") === "1") setDark(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
    router.replace("/dashboard");
  }

  return (
    <div style={{ ...(dark ? darkVars : {}), minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit)", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 20, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.4px" }}>MindTrade</span>
          </a>
          <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 6 }}>Accède à ton espace trader</div>
        </div>

        {paid && (
          <div style={{ background: "var(--tint-g-bg)", border: "1px solid var(--tint-g-border)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--g)", marginBottom: 2 }}>Paiement confirmé !</div>
            <div style={{ fontSize: 13, color: "var(--ink2)" }}>Connecte-toi pour accéder à ton dashboard.</div>
          </div>
        )}

        {/* Card */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px" }}>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", display: "block", marginBottom: 6 }}>Adresse email</label>
              <input
                type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box", outline: "none" }}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", display: "block", marginBottom: 6 }}>Mot de passe</label>
              <input
                type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box", outline: "none" }}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              />
            </div>

            {error && (
              <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--r)" }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "var(--navy)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1, transition: "opacity .15s" }}>
              {loading ? "..." : "Se connecter →"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--ink3)" }}>
          <a href="/" style={{ color: "var(--ink3)", textDecoration: "none" }}>← Retour au site</a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
