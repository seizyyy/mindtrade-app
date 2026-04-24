"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase";

const darkVars = {
  "--bg":     "#0f172a",
  "--bg2":    "#1e293b",
  "--card":   "#1e293b",
  "--ink":    "#f1f5f9",
  "--ink2":   "#cbd5e1",
  "--ink3":   "#94a3b8",
  "--border": "rgba(241,245,249,0.09)",
  "--navy":   "#3b82f6",
  "--g":      "#22c55e",
  "--r":      "#ef4444",
  "--tint-r-bg":     "rgba(239,68,68,.12)",
  "--tint-r-border": "rgba(239,68,68,.25)",
  "--tint-g-bg":     "rgba(34,197,94,.10)",
  "--tint-g-border": "rgba(34,197,94,.25)",
} as React.CSSProperties;

function ResetForm() {
  const supabase = createClient();
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mt-dark") === "1") setDark(true);

    // Supabase envoie le token dans le hash — détecter l'event PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError("Erreur. Vérifie l'adresse email."); return; }
    setSent(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError("Erreur lors de la mise à jour."); return; }
    setSaved(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--ink)",
    fontFamily: "var(--font-outfit)", boxSizing: "border-box", outline: "none",
  };

  return (
    <div style={{ ...(dark ? darkVars : {}), minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit)", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 20, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.4px" }}>MindTrade</span>
          </a>
          <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 6 }}>
            {isRecovery ? "Choisis un nouveau mot de passe" : "Réinitialiser le mot de passe"}
          </div>
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px" }}>
          {saved ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Mot de passe mis à jour</div>
              <a href="/login" style={{ display: "block", padding: "12px", borderRadius: 8, background: "var(--navy)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, textAlign: "center", marginTop: 20 }}>
                Se connecter →
              </a>
            </div>
          ) : sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Email envoyé</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.6 }}>
                Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
              </div>
            </div>
          ) : isRecovery ? (
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", display: "block", marginBottom: 6 }}>Nouveau mot de passe</label>
                <input
                  type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères" autoComplete="new-password"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--navy)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
              {error && (
                <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--r)" }}>{error}</div>
              )}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "var(--navy)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Mise à jour…" : "Mettre à jour →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequest}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", display: "block", marginBottom: 6 }}>Adresse email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.com" autoComplete="email"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--navy)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
              {error && (
                <div style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--r)" }}>{error}</div>
              )}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "var(--navy)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Envoi…" : "Envoyer le lien →"}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--ink3)" }}>
          <a href="/login" style={{ color: "var(--ink3)", textDecoration: "none" }}>← Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
