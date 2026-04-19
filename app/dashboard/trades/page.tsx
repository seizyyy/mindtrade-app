"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { sym } from "@/lib/currency";

type Trade = {
  id: string;
  date: string;
  pair: string;
  direction: "LONG" | "SHORT";
  pnl: number;
  mental_score: number | null;
  emotion: string;
  respected_rules: boolean;
  notes: string | null;
};

const emotions = ["Calme", "Confiant", "Anxieux", "FOMO", "Revenge", "Euphorique", "Frustré", "Impatient"];
const pairs = [
  // Forex majeurs
  "EUR/USD","GBP/USD","USD/JPY","USD/CHF","AUD/USD","NZD/USD","USD/CAD",
  // Forex croisés
  "EUR/GBP","EUR/JPY","EUR/CHF","EUR/AUD","EUR/CAD","EUR/NZD",
  "GBP/JPY","GBP/CHF","GBP/AUD","GBP/CAD","GBP/NZD",
  "AUD/JPY","AUD/CHF","AUD/CAD","AUD/NZD",
  "CAD/JPY","CAD/CHF","NZD/JPY","NZD/CHF","CHF/JPY",
  // Forex exotiques
  "USD/MXN","USD/ZAR","USD/TRY","USD/SEK","USD/NOK","USD/DKK","USD/SGD","USD/HKD","USD/CNH","USD/PLN","USD/CZK","USD/HUF",
  "EUR/PLN","EUR/CZK","EUR/HUF","EUR/SEK","EUR/NOK","EUR/DKK","EUR/TRY",
  // Matières premières
  "Or (XAU/USD)","Argent (XAG/USD)","Pétrole WTI (CL)","Pétrole Brent (BRN)","Gaz Naturel (NG)","Cuivre (HG)","Platine (XPT)","Palladium (XPD)",
  // Indices
  "Nasdaq 100 (NQ)","S&P 500 (ES)","Dow Jones (YM)","Russell 2000 (RTY)",
  "DAX (GER40)","CAC 40 (FRA40)","FTSE 100 (UK100)","Nikkei 225 (JP225)",
  "Hang Seng (HK50)","ASX 200 (AUS200)","Euro Stoxx 50 (EU50)",
  // Crypto
  "BTC/USD","ETH/USD","BTC/USDT","ETH/USDT","SOL/USD","BNB/USD","XRP/USD",
  "ADA/USD","DOGE/USD","AVAX/USD","MATIC/USD","DOT/USD","LINK/USD","UNI/USD",
  "LTC/USD","BCH/USD","ATOM/USD","FIL/USD","NEAR/USD","APT/USD",
  // Actions US populaires
  "AAPL","TSLA","NVDA","MSFT","AMZN","GOOGL","META","AMD","NFLX","COIN",
  // Futures
  "ES (S&P Futures)","NQ (Nasdaq Futures)","CL (Crude Oil Futures)","GC (Gold Futures)","ZB (Bond Futures)",
];

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "long", label: "Long" },
  { id: "short", label: "Short" },
  { id: "win", label: "Gagnants" },
  { id: "loss", label: "Perdants" },
  { id: "broken", label: "Règles non respectées" },
];

const emotionColors: Record<string, string> = {
  Calme: "var(--g)", Confiant: "var(--navy)", Anxieux: "var(--a)",
  FOMO: "var(--r)", Revenge: "var(--r)", Euphorique: "var(--gold)",
  Frustré: "var(--a)", Impatient: "var(--a)",
};

export default function TradesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [accountSize, setAccountSize] = useState<number | null>(null);
  const [currency, setCurrency] = useState("EUR");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todayScore, setTodayScore] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    pair: "EUR/USD",
    direction: "LONG" as "LONG" | "SHORT",
    pnl: "",
    mental_score: "",
    emotion: "Calme",
    respected_rules: true,
    notes: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }

    const today = new Date().toISOString().split("T")[0];
    const [{ data: ci }, { data }, { data: profile }] = await Promise.all([
      supabase.from("checkins").select("score").eq("user_id", user.id).eq("date", today).single(),
      supabase.from("trades").select("*").eq("user_id", user.id).order("date", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("profiles").select("account_size,currency").eq("id", user.id).single(),
    ]);
    if (ci) setTodayScore(ci.score);
    if (profile?.account_size) setAccountSize(profile.account_size);
    if (profile?.currency) setCurrency(profile.currency);
    setTrades(data || []);
    setLoading(false);
  }

  async function saveTrade() {
    if (!form.pnl) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("trades").insert({
      user_id: user.id,
      date: form.date,
      pair: form.pair,
      direction: form.direction,
      pnl: parseFloat(form.pnl),
      mental_score: form.mental_score ? parseInt(form.mental_score) : todayScore,
      emotion: form.emotion,
      respected_rules: form.respected_rules,
      notes: form.notes || null,
    });

    setForm({ date: new Date().toISOString().split("T")[0], pair: "EUR/USD", direction: "LONG", pnl: "", mental_score: "", emotion: "Calme", respected_rules: true, notes: "" });
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function deleteTrade(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    setDeletingId(id);
    await supabase.from("trades").delete().eq("id", id);
    setTrades(t => t.filter(x => x.id !== id));
    setDeletingId(null);
  }

  const filtered = trades.filter(t => {
    if (filter === "long") return t.direction === "LONG";
    if (filter === "short") return t.direction === "SHORT";
    if (filter === "win") return t.pnl > 0;
    if (filter === "loss") return t.pnl < 0;
    if (filter === "broken") return !t.respected_rules;
    return true;
  });

  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const total = trades.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const pnlNet = trades.reduce((s, t) => s + t.pnl, 0);
  const rulesOk = total > 0 ? Math.round((trades.filter(t => t.respected_rules).length / total) * 100) : 0;
  const avgScore = trades.filter(t => t.mental_score).length > 0
    ? Math.round(trades.filter(t => t.mental_score).reduce((s, t) => s + (t.mental_score || 0), 0) / trades.filter(t => t.mental_score).length)
    : null;

  const pnlColor = pnlNet > 0 ? "var(--g)" : pnlNet < 0 ? "var(--r)" : "var(--ink3)";

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 13 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 940, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Log de trades</div>
          <div style={{ fontSize: 13, color: "var(--ink2)" }}>Toutes tes positions enregistrées</div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nouveau trade
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Trades", value: total, sub: `${wins}W / ${losses}L` },
          { label: "Win Rate", value: `${winRate}%`, sub: total > 0 ? (winRate >= 55 ? "Bon" : winRate >= 45 ? "Correct" : "À améliorer") : "—" },
          { label: "P&L Net", value: `${pnlNet >= 0 ? "+" : ""}${pnlNet.toFixed(0)}${sym(currency)}`, sub: accountSize ? `${pnlNet >= 0 ? "+" : ""}${((pnlNet / accountSize) * 100).toFixed(2)}%` : null, color: pnlColor },
          { label: "Règles", value: `${rulesOk}%`, sub: "respectées", color: rulesOk >= 80 ? "var(--g)" : rulesOk >= 60 ? "var(--a)" : "var(--r)" },
          { label: "Score moyen", value: avgScore ?? "—", sub: avgScore ? (avgScore >= 75 ? "Optimal" : avgScore >= 60 ? "Correct" : "Bas") : "Pas de données" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 700, color: s.color || "var(--ink)", lineHeight: 1 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 3 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>Nouveau trade</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>Paire / Actif</label>
              <input
                list="pairs-list"
                value={form.pair}
                onChange={e => setForm({ ...form, pair: e.target.value })}
                placeholder="Rechercher ou taper..."
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box", outline: "none" }}
              />
              <datalist id="pairs-list">
                {pairs.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>Direction</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["LONG", "SHORT"] as const).map(d => (
                  <button key={d} onClick={() => setForm({ ...form, direction: d })}
                    style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: `1.5px solid ${form.direction === d ? (d === "LONG" ? "var(--g)" : "var(--r)") : "var(--border)"}`, background: form.direction === d ? (d === "LONG" ? "var(--tint-g-bg)" : "var(--tint-r-bg)") : "var(--bg2)", color: form.direction === d ? (d === "LONG" ? "var(--g)" : "var(--r)") : "var(--ink3)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {d === "LONG" ? "↑ LONG" : "↓ SHORT"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>P&L ({sym(currency)})</label>
              <input type="number" step="0.01" placeholder="+150 ou -75" value={form.pnl} onChange={e => setForm({ ...form, pnl: e.target.value })}
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>Émotion</label>
              <select value={form.emotion} onChange={e => setForm({ ...form, emotion: e.target.value })}
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}>
                {emotions.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>
                Score mental {todayScore ? <span style={{ color: "var(--navy)", fontWeight: 400 }}>(auto: {todayScore})</span> : ""}
              </label>
              <input type="number" min="0" max="100" placeholder={todayScore ? String(todayScore) : "0-100"} value={form.mental_score} onChange={e => setForm({ ...form, mental_score: e.target.value })}
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end", marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>Notes (optionnel)</label>
              <input type="text" placeholder="Setup utilisé, contexte, raison de sortie..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink3)", display: "block", marginBottom: 5 }}>Règles</label>
              <button onClick={() => setForm({ ...form, respected_rules: !form.respected_rules })}
                style={{ padding: "9px 16px", borderRadius: 7, border: `1.5px solid ${form.respected_rules ? "var(--g)" : "var(--r)"}`, background: form.respected_rules ? "var(--tint-g-bg)" : "var(--tint-r-bg)", color: form.respected_rules ? "var(--g)" : "var(--r)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>
                {form.respected_rules ? "✓ Respectées" : "✕ Non respectées"}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)}
              style={{ padding: "10px 20px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--ink2)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Annuler
            </button>
            <button onClick={saveTrade} disabled={saving || !form.pnl}
              style={{ padding: "10px 24px", borderRadius: 7, border: "none", background: "var(--navy)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving || !form.pnl ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: saving || !form.pnl ? 0.6 : 1 }}>
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${filter === f.id ? "var(--navy)" : "var(--border)"}`, background: filter === f.id ? "var(--tint-n-bg)" : "var(--card)", color: filter === f.id ? "var(--navy)" : "var(--ink3)", fontSize: 12, fontWeight: filter === f.id ? 700 : 500, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            {f.label}
            {f.id === "all" && total > 0 && <span style={{ marginLeft: 6, background: "var(--bg3)", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>{total}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          trades.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 24px" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>📝</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Aucun trade enregistré</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20, maxWidth: 340, margin: "0 auto 20px" }}>
                Commence à logger tes positions pour suivre ta progression et identifier tes patterns.
              </div>
              <button onClick={() => setShowForm(true)}
                style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                + Ajouter mon premier trade
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 24px" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Aucun trade pour ce filtre</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14 }}>Essaie un autre filtre ou reviens à "Tous".</div>
              <button onClick={() => setFilter("all")}
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "var(--ink2)", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                Voir tous les trades
              </button>
            </div>
          )
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Date", "Actif", "Direction", "P&L", "Score", "Émotion", "Règles", "Notes", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".06em", textAlign: i >= 2 ? "center" : "left", background: "var(--bg2)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const pnlPos = t.pnl > 0;
                const pnlNeg = t.pnl < 0;
                const eColor = emotionColors[t.emotion] || "var(--ink3)";
                return (
                  <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "var(--bg2)"}
                    onMouseOut={e => (e.currentTarget as HTMLElement).style.background = ""}>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--ink3)" }}>
                      {new Date(t.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{t.pair}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: t.direction === "LONG" ? "var(--g)" : "var(--r)", background: t.direction === "LONG" ? "var(--tint-g-bg)" : "var(--tint-r-bg)", border: `1px solid ${t.direction === "LONG" ? "var(--tint-g-border)" : "var(--tint-r-border)"}`, borderRadius: 4, padding: "2px 8px" }}>
                        {t.direction === "LONG" ? "↑ L" : "↓ S"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontFamily: "var(--font-fraunces)", fontSize: 14, fontWeight: 700, color: pnlPos ? "var(--g)" : pnlNeg ? "var(--r)" : "var(--ink3)" }}>
                      {t.pnl > 0 ? "+" : ""}{t.pnl.toFixed(0)}{sym(currency)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      {t.mental_score ? (
                        <span style={{ fontSize: 12, fontWeight: 700, color: t.mental_score >= 75 ? "var(--g)" : t.mental_score >= 60 ? "var(--a)" : "var(--r)" }}>
                          {t.mental_score}
                        </span>
                      ) : <span style={{ color: "var(--ink3)", fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: eColor, background: `${eColor}15`, borderRadius: 4, padding: "2px 8px" }}>
                        {t.emotion}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      <span style={{ fontSize: 14, color: t.respected_rules ? "var(--g)" : "var(--r)" }}>
                        {t.respected_rules ? "✓" : "✕"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--ink3)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.notes || "—"}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                      {confirmDeleteId === t.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button onClick={() => deleteTrade(t.id)} disabled={deletingId === t.id}
                            style={{ background: "var(--tint-r-bg)", border: "1px solid var(--tint-r-border)", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "var(--r)", cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>
                            {deletingId === t.id ? "..." : "Supprimer"}
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink3)", fontSize: 13, padding: "2px 4px" }}>
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => deleteTrade(t.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink3)", fontSize: 15, padding: "2px 6px", borderRadius: 4, opacity: 0.5 }}
                          onMouseOver={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                          onMouseOut={e => (e.currentTarget as HTMLElement).style.opacity = "0.5"}>
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink3)", textAlign: "right" }}>
          {filtered.length} trade{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
        </div>
      )}

      {/* Analyse par émotion */}
      {trades.length > 0 && (() => {
        const emotionStats: Record<string, { count: number; pnl: number; wins: number }> = {};
        trades.forEach(t => {
          if (!emotionStats[t.emotion]) emotionStats[t.emotion] = { count: 0, pnl: 0, wins: 0 };
          emotionStats[t.emotion].count++;
          emotionStats[t.emotion].pnl += t.pnl;
          if (t.pnl > 0) emotionStats[t.emotion].wins++;
        });
        const sorted = Object.entries(emotionStats).sort((a, b) => b[1].count - a[1].count);
        return (
          <div style={{ marginTop: 28, borderTop: "2px solid var(--border)", paddingTop: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Performance par état émotionnel</div>
            <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 16 }}>Corrélation entre tes émotions et tes résultats</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }}>
              {sorted.map(([emotion, stats]) => {
                const wr = Math.round((stats.wins / stats.count) * 100);
                const color = wr >= 55 ? "var(--g)" : wr >= 40 ? "var(--a)" : "var(--r)";
                const bg = wr >= 55 ? "var(--tint-g-bg)" : wr >= 40 ? "var(--tint-a-bg)" : "var(--tint-r-bg)";
                const border = wr >= 55 ? "var(--tint-g-border)" : wr >= 40 ? "var(--tint-a-border)" : "var(--tint-r-border)";
                return (
                  <div key={emotion} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{emotion}</div>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, color, fontWeight: 700, lineHeight: 1 }}>{wr}%</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 5 }}>{stats.count} trade{stats.count > 1 ? "s" : ""} · {stats.pnl >= 0 ? "+" : ""}{stats.pnl.toFixed(0)}{sym(currency)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Rappels discipline */}
      <div style={{ marginTop: 28, borderTop: "2px solid var(--border)", paddingTop: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Rappels de discipline</div>
        <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 16 }}>Les règles qui protègent ton capital</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { icon: "⚖️", title: "Ton ratio risque/récompense", text: "Définis ton RR minimum selon ta stratégie et ne le négocie jamais à l'entrée. Ce seuil dépend de ton style — l'essentiel est de le connaître et de le respecter.", color: "var(--tint-n-bg)", border: "var(--tint-n-border)" },
            { icon: "🎯", title: "Qualité sur quantité", text: "Peu importe ton style de trading, chaque entrée doit correspondre à tes critères. Un trade qui ne remplit pas tes conditions n'est pas un trade manqué — c'est une erreur évitée.", color: "var(--tint-a-bg)", border: "var(--tint-a-border)" },
            { icon: "📏", title: "Taille de position & état mental", text: "Réduis ta taille quand ton score mental est sous 70. L'état émotionnel amplifie les erreurs de jugement, quelle que soit ta stratégie.", color: "var(--tint-r-bg)", border: "var(--tint-r-border)" },
          ].map((tip, i) => (
            <div key={i} style={{ background: tip.color, border: `1px solid ${tip.border}`, borderRadius: 12, padding: "18px" }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{tip.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.65 }}>{tip.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
