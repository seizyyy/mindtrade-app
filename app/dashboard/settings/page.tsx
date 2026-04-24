"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const MARKETS = ["Forex", "Indices / Futures", "Actions", "Crypto", "Matières premières"];
const BIASES  = ["FOMO", "Revenge trading", "Overtrading", "Sorties prématurées", "Déplacer ses stops", "Sous-dimensionnement"];

export default function SettingsPage() {
  const supabase = createClient();

  const [displayName,  setDisplayName]  = useState("");
  const [market,       setMarket]       = useState("Forex");
  const [accountSize,  setAccountSize]  = useState("");
  const [currency,     setCurrency]     = useState("EUR");
  const [maxRisk,      setMaxRisk]      = useState("");
  const [maxDailyLoss, setMaxDailyLoss] = useState("");
  const [monthlyGoal,  setMonthlyGoal]  = useState("");
  const [biases,       setBiases]       = useState<string[]>([]);
  const [plan,         setPlan]         = useState<string | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name,market,account_size,currency,max_risk_per_trade,max_daily_loss,monthly_goal,session_start,session_end,trading_biases,plan")
        .eq("id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setMarket(data.market ?? "Forex");
        setAccountSize(data.account_size != null ? String(data.account_size) : "");
        setCurrency(data.currency ?? "EUR");
        setMaxRisk(data.max_risk_per_trade != null ? String(data.max_risk_per_trade) : "");
        setMaxDailyLoss(data.max_daily_loss != null ? String(data.max_daily_loss) : "");
        setMonthlyGoal(data.monthly_goal != null ? String(data.monthly_goal) : "");
        setSessionStart(data.session_start ?? "");
        setSessionEnd(data.session_end ?? "");
        setBiases(data.trading_biases ?? []);
        setPlan(data.plan ?? null);
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
      display_name:      displayName || null,
      market:            market || null,
      account_size:      accountSize  ? parseFloat(accountSize)  : null,
      currency,
      max_risk_per_trade: maxRisk     ? parseFloat(maxRisk)      : null,
      max_daily_loss:    maxDailyLoss ? parseFloat(maxDailyLoss) : null,
      monthly_goal:      monthlyGoal  ? parseFloat(monthlyGoal)  : null,
      trading_biases:    biases.length ? biases : null,
    }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleBias(b: string) {
    setBiases(prev => prev.includes(b) ? prev.filter(x => x !== b) : prev.length < 2 ? [...prev, b] : prev);
  }

  const cap = accountSize && !isNaN(parseFloat(accountSize)) ? parseFloat(accountSize) : null;

  const field: React.CSSProperties = {
    width: "100%", padding: "10px 13px", borderRadius: 7,
    border: "1px solid var(--border)", background: "var(--bg2)",
    color: "var(--ink)", fontSize: 14, fontFamily: "var(--font-outfit)",
    outline: "none", boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "var(--ink3)",
    textTransform: "uppercase", letterSpacing: ".1em", display: "block", marginBottom: 6,
  };
  const card: React.CSSProperties = {
    background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px",
  };
  const hint: React.CSSProperties = {
    fontSize: 12, color: "var(--ink3)", marginTop: 6, lineHeight: 1.5,
  };

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 14, padding: 40 }}>Chargement…</div>;

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Paramètres</h1>
        <p style={{ fontSize: 13, color: "var(--ink3)" }}>Tes préférences et informations de compte.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── Profil ── */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>Profil</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={label}>Prénom / pseudo</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Ex : Thomas" style={field} />
            </div>
            <div>
              <label style={label}>Marché principal</label>
              <select value={market} onChange={e => setMarket(e.target.value)} style={field}>
                {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Capital + Règles de risque ── */}
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

            {/* Capital */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Capital de trading</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14, lineHeight: 1.5 }}>Utilisé pour calculer tes montants réels. Non partagé.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
                <div>
                  <label style={label}>Taille du compte</label>
                  <input type="number" min="0" step="100" value={accountSize} onChange={e => setAccountSize(e.target.value)} placeholder="Ex : 10 000" style={field} />
                </div>
                <div>
                  <label style={label}>Devise</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...field, width: "auto", minWidth: 84 }}>
                    {[["EUR","€"],["USD","$"],["GBP","£"],["CHF","CHF"],["CAD","CA$"],["JPY","¥"]].map(([code, sym]) => (
                      <option key={code} value={code}>{sym} {code}</option>
                    ))}
                  </select>
                </div>
              </div>
              {cap && <div style={hint}>1% = <strong style={{ color: "var(--ink)" }}>{(cap / 100).toFixed(0)} {currency}</strong></div>}
            </div>

            {/* Séparateur vertical */}
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Règles de risque</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14, lineHeight: 1.5 }}>MindTrade t'alerte si tu approches ces limites en check-in.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={label}>Risque max / trade ({currency})</label>
                  <input type="number" min="0" step="1" value={maxRisk} onChange={e => setMaxRisk(e.target.value)} placeholder="Ex : 500" style={field} />
                  {cap && maxRisk && <div style={hint}>= <strong style={{ color: "var(--ink)" }}>{((parseFloat(maxRisk) / cap) * 100).toFixed(2)}%</strong> de ton capital</div>}
                </div>
                <div>
                  <label style={label}>Perte max / jour ({currency})</label>
                  <input type="number" min="0" step="1" value={maxDailyLoss} onChange={e => setMaxDailyLoss(e.target.value)} placeholder="Ex : 1000" style={field} />
                  {cap && maxDailyLoss && <div style={hint}>= <strong style={{ color: "var(--ink)" }}>{((parseFloat(maxDailyLoss) / cap) * 100).toFixed(2)}%</strong> de ton capital</div>}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Objectif mensuel + Session ── */}
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

            {/* Objectif */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Objectif mensuel</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14, lineHeight: 1.5 }}>Affiché en barre de progression dans la carte P&L.</div>
              <label style={label}>Pourcentage visé ce mois</label>
              <div style={{ position: "relative" }}>
                <input type="number" min="0" max="1000" step="0.5" value={monthlyGoal} onChange={e => setMonthlyGoal(e.target.value)} placeholder="Ex : 5" style={{ ...field, paddingRight: 26 }} />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--ink3)" }}>%</span>
              </div>
              {cap && monthlyGoal && <div style={hint}>= <strong style={{ color: "var(--ink)" }}>{((cap * parseFloat(monthlyGoal)) / 100).toFixed(0)} {currency}</strong> à atteindre</div>}
            </div>


          </div>
        </div>

        {/* ── Biais ── */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Biais à surveiller</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: biases.length >= 2 ? "var(--navy)" : "var(--ink3)" }}>
              {biases.length}/2
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14, lineHeight: 1.5 }}>
            Choisis tes 2 points faibles principaux — ajoutés comme questions dans ta réflexion post-session.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BIASES.map(b => {
              const active = biases.includes(b);
              const disabled = !active && biases.length >= 2;
              return (
                <button key={b} onClick={() => toggleBias(b)} disabled={disabled} style={{
                  padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                  fontFamily: "var(--font-outfit)", cursor: disabled ? "not-allowed" : "pointer", transition: "all .12s",
                  border: `1.5px solid ${active ? "var(--navy)" : "var(--border)"}`,
                  background: active ? "rgba(15,39,68,.07)" : "transparent",
                  color: active ? "var(--navy)" : "var(--ink3)",
                  opacity: disabled ? 0.35 : 1,
                }}>
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Abonnement ── */}
        {plan && (() => {
          const isLifetime = plan === "lifetime";
          const isAnnual   = plan === "annual";
          const label      = isLifetime ? "Lifetime" : isAnnual ? "Annuel" : "Mensuel";
          const badgeColor = isLifetime ? "#c9a84c" : isAnnual ? "var(--navy)" : "var(--ink3)";
          const badgeBg    = isLifetime ? "rgba(201,168,76,.13)" : isAnnual ? "rgba(15,39,68,.08)" : "rgba(0,0,0,.05)";
          return (
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Abonnement actif</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
                      background: badgeBg, color: badgeColor,
                      border: `1.5px solid ${badgeColor}`,
                      letterSpacing: ".05em",
                    }}>{label}</span>
                    {isLifetime && (
                      <span style={{ fontSize: 12, color: "var(--ink3)" }}>Vous avez accès à MindTrade dans son intégralité, à vie.</span>
                    )}
                    {!isLifetime && (
                      <span style={{ fontSize: 12, color: "var(--ink3)" }}>
                        {isAnnual ? "Facturation annuelle" : "Facturation mensuelle"}
                      </span>
                    )}
                  </div>
                </div>
                {!isLifetime && (
                  <a href="/dashboard/alpha" style={{
                    padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    background: "var(--navy)", color: "#fff", textDecoration: "none",
                    fontFamily: "var(--font-outfit)",
                  }}>
                    Passer à Lifetime →
                  </a>
                )}
              </div>
              {!isLifetime && (
                <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 12, lineHeight: 1.6, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  {isAnnual
                    ? "Abonné annuel — ton montant déjà payé est déduit du prix Lifetime. Profite de MindTrade Alpha au tarif préférentiel."
                    : "Abonné mensuel — le montant déjà payé est déduit du Lifetime. Accède à MindTrade Alpha avec un rabais immédiat."}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Save ── */}
        <div>
          <button onClick={save} disabled={saving} style={{
            padding: "11px 28px", borderRadius: 8, border: "none",
            background: saved ? "var(--g)" : "var(--navy)", color: "#fff",
            fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "var(--font-outfit)", opacity: saving ? 0.7 : 1, transition: "background .2s",
          }}>
            {saved ? "✓ Sauvegardé" : saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>

      </div>
    </div>
  );
}
