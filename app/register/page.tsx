"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

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

const PLAN_LABELS: Record<string, { label: string; price: string }> = {
  monthly:  { label: "Mensuel",  price: "39€/mois" },
  annual:   { label: "Annuel",   price: "290€/an" },
  lifetime: { label: "Lifetime", price: "597€ une fois" },
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "";
  const supabase = createClient();

  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const success = searchParams.get("success") === "1";

  useEffect(() => {
    if (localStorage.getItem("mt-dark") === "1") setDark(true);
    if (plan) localStorage.setItem("mt-pending-plan", plan);

    // Already logged in + plan selected → go straight to Stripe
    if (plan) {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;
        const { data: profile } = await supabase.from("profiles").select("plan_active").eq("id", user.id).single();
        if (profile?.plan_active) { window.location.href = "/dashboard"; return; }
        setLoading(true);
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, email: user.email, userId: user.id }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else setLoading(false);
      });
    }
  }, [plan]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError && signUpError.message !== "User already registered") {
      setError("Une erreur est survenue. Réessaie.");
      setLoading(false);
      return;
    }

    // Get user ID (either from signup or existing session)
    let userId = signUpData?.user?.id;
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!plan) {
      window.location.href = "/dashboard";
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email, userId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Erreur lors de la redirection vers le paiement.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Réessaie.");
      setLoading(false);
    }
  }

  const planInfo = PLAN_LABELS[plan];

  return (
    <div style={{ ...(dark ? darkVars : {}), minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit)", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 20, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.4px" }}>MindTrade</span>
          </a>
          <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 6 }}>Crée ton compte pour commencer</div>
        </div>

        {planInfo && (
          <div style={{ background: "var(--tint-n-bg)", border: "1px solid var(--tint-n-border)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "var(--ink2)" }}>Plan sélectionné</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{planInfo.label} · {planInfo.price}</span>
          </div>
        )}

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px" }}>
          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Paiement confirmé !</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.6, marginBottom: 24 }}>
                Ton accès MindTrade est activé. Connecte-toi pour commencer ton premier check-in mental.
              </div>
              <a href="/login" style={{ display: "block", padding: "12px", borderRadius: 8, background: "var(--navy)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, textAlign: "center" }}>
                Accéder à mon dashboard →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", display: "block", marginBottom: 6 }}>Adresse email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--navy)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", display: "block", marginBottom: 6 }}>Mot de passe</label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="new-password"
                  style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--navy)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 5 }}>Minimum 6 caractères</div>
              </div>

              {error && (
                <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--r)" }}>
                  {error}
                  {error.includes("connecte-toi") && (
                    <a href="/login" style={{ display: "block", marginTop: 6, fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>→ Se connecter</a>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "var(--navy)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Redirection vers le paiement…" : plan ? "Créer mon compte et payer →" : "Créer mon compte →"}
              </button>

              <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--ink3)", lineHeight: 1.6 }}>
                En créant un compte, tu acceptes nos{" "}
                <a href="/cgu" style={{ color: "var(--navy)", textDecoration: "none" }}>CGU</a>{" "}
                et notre{" "}
                <a href="/confidentialite" style={{ color: "var(--navy)", textDecoration: "none" }}>politique de confidentialité</a>.
              </div>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--ink3)" }}>
          Déjà un compte ?{" "}
          <a href="/login" style={{ color: "var(--navy)", textDecoration: "none", fontWeight: 600 }}>Se connecter</a>
          {" · "}
          <a href="/" style={{ color: "var(--ink3)", textDecoration: "none" }}>← Retour au site</a>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
