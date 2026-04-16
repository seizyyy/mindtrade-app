"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [accountSize, setAccountSize] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name,market,account_size,currency")
        .eq("id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setAccountSize(data.account_size != null ? String(data.account_size) : "");
        setCurrency(data.currency ?? "USD");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({
      display_name: displayName || null,
      account_size: accountSize ? parseFloat(accountSize) : null,
      currency,
    }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px", borderRadius: 7,
    border: "1px solid var(--border)", background: "var(--bg2)",
    color: "var(--ink)", fontSize: 14, fontFamily: "var(--font-outfit)",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "var(--ink3)",
    textTransform: "uppercase", letterSpacing: ".1em", display: "block", marginBottom: 6,
  };

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 14, padding: 40 }}>Chargement…</div>;

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Paramètres</h1>
        <p style={{ fontSize: 13, color: "var(--ink3)" }}>Tes préférences et informations de compte.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Nom affiché */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>Profil</div>
          <div>
            <label style={labelStyle}>Prénom / pseudo</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Ex : Thomas"
              style={fieldStyle}
            />
          </div>
        </div>

        {/* Taille du compte */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Capital de trading</div>
          <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16, lineHeight: 1.5 }}>
            Utilisé pour calculer ton % de rendement sur le dashboard. Non partagé.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
            <div>
              <label style={labelStyle}>Taille du compte</label>
              <input
                type="number"
                min="0"
                step="100"
                value={accountSize}
                onChange={e => setAccountSize(e.target.value)}
                placeholder="Ex : 10000"
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Devise</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...fieldStyle, width: "auto", minWidth: 90 }}>
                {[
                  { code: "EUR", symbol: "€" },
                  { code: "USD", symbol: "$" },
                  { code: "GBP", symbol: "£" },
                  { code: "CHF", symbol: "CHF" },
                  { code: "CAD", symbol: "CA$" },
                  { code: "JPY", symbol: "¥" },
                ].map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                ))}
              </select>
            </div>
          </div>
          {accountSize && !isNaN(parseFloat(accountSize)) && (
            <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 8 }}>
              1% de ton compte = <strong style={{ color: "var(--ink)" }}>{(parseFloat(accountSize) / 100).toFixed(0)} {currency}</strong> par trade
            </div>
          )}
        </div>

        {/* Bouton */}
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "12px 24px", borderRadius: 8, border: "none",
            background: saved ? "var(--g)" : "var(--navy)", color: "#fff",
            fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "var(--font-outfit)", opacity: saving ? 0.7 : 1,
            transition: "background .2s",
          }}
        >
          {saved ? "✓ Sauvegardé" : saving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
