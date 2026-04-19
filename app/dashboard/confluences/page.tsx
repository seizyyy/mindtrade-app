"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Confluence = {
  id: string;
  titre: string;
  description: string | null;
  type: "required" | "bonus";
  created_at: string;
};

type PreTradeQ = {
  id: string;
  q: string;
  detail: string;
};

const DEFAULT_PRETRADE: PreTradeQ[] = [
  { id: "d1", q: "Mon setup correspond-il exactement à mes règles d'entrée ?", detail: "Pas \"presque\" — exactement. Toute déviation est une erreur de discipline, pas de stratégie." },
  { id: "d2", q: "Où est mon stop loss et pourquoi à cet endroit précis ?", detail: "Un stop positionné par logique de marché, pas par confort psychologique sur la perte acceptable." },
  { id: "d3", q: "Mon ratio risque/récompense atteint-il mon seuil minimum ?", detail: "Chaque stratégie a son propre seuil. Connais le tien — et ne le négocie pas." },
  { id: "d4", q: "Quelles conditions invalideraient ce trade avant l'entrée ?", detail: "Si tu n'as pas de scénario d'invalidation, tu n'as pas de plan — tu as une espérance." },
  { id: "d5", q: "Mon état mental aujourd'hui est-il compatible avec ce trade ?", detail: "Un bon setup pris dans un mauvais état mental reste un mauvais trade. Consulte ton score." },
];

function lsKey(userId: string) { return `mt-pretrade-questions-${userId}`; }

function loadQuestions(userId: string): PreTradeQ[] {
  if (typeof window === "undefined") return DEFAULT_PRETRADE;
  try {
    const raw = localStorage.getItem(lsKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PRETRADE;
}

function saveQuestions(userId: string, qs: PreTradeQ[]) {
  localStorage.setItem(lsKey(userId), JSON.stringify(qs));
}

export default function ConfluencesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [confluences, setConfluences] = useState<Confluence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [minConfluences, setMinConfluences] = useState<number>(1);
  const [form, setForm] = useState({ titre: "", description: "", type: "required" as "required" | "bonus" });

  // Pre-trade quiz
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [ptQuestions, setPtQuestions] = useState<PreTradeQ[]>([]);
  const [ptStep, setPtStep] = useState<number | null>(null); // null = not started
  const [ptAnswers, setPtAnswers] = useState<Record<string, "oui" | "non">>({});
  const [ptDone, setPtDone] = useState(false);
  const [ptManage, setPtManage] = useState(false); // manage questions mode
  const [ptNewQ, setPtNewQ] = useState("");
  const [ptNewDetail, setPtNewDetail] = useState("");
  const [ptAddingQ, setPtAddingQ] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    setCurrentUserId(user.id);
    setPtQuestions(loadQuestions(user.id));
    const saved = localStorage.getItem(`mt-min-confluences-${user.id}`);
    if (saved) setMinConfluences(parseInt(saved));
    const { data } = await supabase.from("confluences").select("*").eq("user_id", user.id).order("type").order("created_at");
    setConfluences(data || []);
    setLoading(false);
  }

  function updateMin(val: number) {
    const clamped = Math.max(1, Math.min(confluences.length || 10, val));
    setMinConfluences(clamped);
    if (currentUserId) localStorage.setItem(`mt-min-confluences-${currentUserId}`, String(clamped));
  }

  async function addConfluence() {
    if (!form.titre.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("confluences").insert({
      user_id: user.id,
      titre: form.titre.trim(),
      description: form.description.trim() || null,
      type: form.type,
    });
    setForm({ titre: "", description: "", type: "required" });
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function deleteConfluence(id: string) {
    await supabase.from("confluences").delete().eq("id", id);
    setCheckedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    load();
  }

  function toggleCheck(id: string) {
    setCheckedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  const required = confluences.filter(c => c.type === "required");
  const bonus = confluences.filter(c => c.type === "bonus");
  const checkedRequired = required.filter(c => checkedIds.has(c.id)).length;
  const checkedBonus = bonus.filter(c => checkedIds.has(c.id)).length;
  const setupScore = confluences.length > 0
    ? Math.round(((checkedRequired * 2 + checkedBonus) / (required.length * 2 + bonus.length)) * 100)
    : null;
  const totalChecked = checkedRequired + checkedBonus;
  const minReached = totalChecked >= minConfluences;
  const setupVerdict = setupScore === null ? null
    : !minReached ? { label: `Minimum non atteint — ${totalChecked}/${minConfluences} confluences cochées`, color: "var(--r)", bg: "var(--tint-r-bg)", border: "var(--tint-r-border)" }
    : setupScore >= 80 ? { label: "Setup valide — tu peux entrer", color: "var(--g)", bg: "var(--tint-g-bg)", border: "var(--tint-g-border)" }
    : setupScore >= 50 ? { label: "Setup partiel — attends confirmation", color: "var(--a)", bg: "var(--tint-a-bg)", border: "var(--tint-a-border)" }
    : { label: "Setup invalide — ne trade pas", color: "var(--r)", bg: "var(--tint-r-bg)", border: "var(--tint-r-border)" };

  function ptDeleteQuestion(id: string) {
    const updated = ptQuestions.filter(q => q.id !== id);
    setPtQuestions(updated);
    saveQuestions(currentUserId, updated);
  }

  function ptAddQuestion() {
    if (!ptNewQ.trim()) return;
    const newQ: PreTradeQ = { id: `custom-${Date.now()}`, q: ptNewQ.trim(), detail: ptNewDetail.trim() };
    const updated = [...ptQuestions, newQ];
    setPtQuestions(updated);
    saveQuestions(currentUserId, updated);
    setPtNewQ("");
    setPtNewDetail("");
    setPtAddingQ(false);
  }

  function ptStartQuiz() {
    setPtAnswers({});
    setPtStep(0);
    setPtDone(false);
  }

  function ptAnswer(id: string, ans: "oui" | "non") {
    const updated = { ...ptAnswers, [id]: ans };
    setPtAnswers(updated);
    const next = ptStep! + 1;
    if (next < ptQuestions.length) {
      setPtStep(next);
    } else {
      setPtDone(true);
      setPtStep(null);
    }
  }

  function ptGoPrev() {
    if (ptStep === null || ptStep === 0) return;
    setPtStep(ptStep - 1);
  }

  const ptNonCount = Object.values(ptAnswers).filter(v => v === "non").length;
  const ptOuiCount = Object.values(ptAnswers).filter(v => v === "oui").length;
  const ptTotal = ptQuestions.length;
  const ptVerdict = ptDone
    ? ptNonCount === 0
      ? { label: "Tu peux entrer en trade ✓", sub: "Toutes tes conditions sont réunies.", color: "var(--g)", bg: "var(--tint-g-bg)", border: "var(--tint-g-border)" }
      : ptNonCount <= 1
      ? { label: "Attends avant d'entrer", sub: `${ptNonCount} condition${ptNonCount > 1 ? "s" : ""} non validée${ptNonCount > 1 ? "s" : ""}. Révise avant d'agir.`, color: "var(--a)", bg: "var(--tint-a-bg)", border: "var(--tint-a-border)" }
      : { label: "Ne trade pas ce setup", sub: `${ptNonCount} conditions non validées sur ${ptTotal}. Le risque est trop élevé.`, color: "var(--r)", bg: "var(--tint-r-bg)", border: "var(--tint-r-border)" }
    : null;

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 13 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 4, fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Confluences</div>
      <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 24 }}>Coche tes confluences avant chaque trade. Le score de validité se calcule automatiquement.</div>

      {/* Explication si pas encore de confluences */}
      {confluences.length === 0 && (
        <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Configure tes confluences</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginBottom: 20 }}>
            Les confluences sont les conditions que ton setup doit réunir avant d{"'"}entrer en trade.<br />
            MindTrade calcule automatiquement leur corrélation avec ton win rate.
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Structure de marché alignée", "Zone de valeur identifiée", "Confirmation de timeframe sup.", "Volume en accord"].map((ex, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
                {ex}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score du setup */}
      {confluences.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Score de validité du setup</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 40, fontWeight: 700, color: setupVerdict?.color || "var(--ink3)", lineHeight: 1 }}>{setupScore ?? "—"}</span>
              <span style={{ fontSize: 14, color: "var(--ink3)" }}>%</span>
            </div>
          </div>
          <div style={{ height: 8, background: "var(--bg3)", borderRadius: 4, marginBottom: 12 }}>
            <div style={{ height: "100%", width: `${setupScore ?? 0}%`, background: setupVerdict?.color || "var(--bg3)", borderRadius: 4, transition: "width .4s" }} />
          </div>
          {setupVerdict && (
            <div style={{ background: setupVerdict.bg, border: `1px solid ${setupVerdict.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 600, color: setupVerdict.color }}>
              {setupVerdict.label}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em" }}>Minimum pour trader</span>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--border)", borderRadius: 7, overflow: "hidden" }}>
                <button onClick={() => updateMin(minConfluences - 1)}
                  style={{ width: 28, height: 28, background: "var(--bg2)", border: "none", color: "var(--ink2)", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", lineHeight: 1 }}>−</button>
                <span style={{ padding: "0 12px", fontSize: 13, fontWeight: 700, color: "var(--ink)", background: "var(--card)", minWidth: 32, textAlign: "center" }}>{minConfluences}</span>
                <button onClick={() => updateMin(minConfluences + 1)}
                  style={{ width: 28, height: 28, background: "var(--bg2)", border: "none", color: "var(--ink2)", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", lineHeight: 1 }}>+</button>
              </div>
              <span style={{ fontSize: 11, color: minReached ? "var(--g)" : "var(--r)", fontWeight: 600 }}>
                {totalChecked}/{minConfluences} {minReached ? "✓" : ""}
              </span>
            </div>
            <button onClick={() => setCheckedIds(new Set())}
              style={{ background: "none", border: "none", fontSize: 12, color: "var(--ink3)", cursor: "pointer", padding: 0, fontFamily: "var(--font-outfit)", textDecoration: "underline" }}>
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Confluences obligatoires */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".06em" }}>Obligatoires</span>
            <span style={{ fontSize: 11, color: "var(--ink3)", marginLeft: 8 }}>{checkedRequired}/{required.length} cochées</span>
          </div>
        </div>
        {required.length === 0 ? (
          <div style={{ background: "var(--card)", border: "1px dashed var(--border)", borderRadius: 10, padding: "20px", textAlign: "center", fontSize: 13, color: "var(--ink3)" }}>
            Ajoute tes confluences obligatoires — elles doivent toutes être présentes pour entrer en trade.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {required.map(c => {
              const checked = checkedIds.has(c.id);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, background: checked ? "var(--tint-g-bg)" : "var(--card)", border: `1px solid ${checked ? "var(--tint-g-border)" : "var(--border)"}`, borderRadius: 10, padding: "12px 16px", transition: "all .15s" }}>
                  <button onClick={() => toggleCheck(c.id)}
                    style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? "var(--g)" : "var(--border)"}`, background: checked ? "var(--g)" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: checked ? "var(--g)" : "var(--ink)", textDecoration: checked ? "none" : "none" }}>{c.titre}</div>
                    {c.description && <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>{c.description}</div>}
                  </div>
                  <button onClick={() => deleteConfluence(c.id)}
                    style={{ background: "none", border: "none", color: "var(--ink3)", cursor: "pointer", padding: "4px", fontSize: 14, lineHeight: 1, opacity: 0.4 }}
                    onMouseOver={e => (e.currentTarget.style.opacity = "1")}
                    onMouseOut={e => (e.currentTarget.style.opacity = "0.4")}>
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confluences bonus */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".06em" }}>Bonus</span>
            <span style={{ fontSize: 11, color: "var(--ink3)", marginLeft: 8 }}>{checkedBonus}/{bonus.length} cochées</span>
          </div>
        </div>
        {bonus.length === 0 ? (
          <div style={{ background: "var(--card)", border: "1px dashed var(--border)", borderRadius: 10, padding: "20px", textAlign: "center", fontSize: 13, color: "var(--ink3)" }}>
            Ajoute des confluences bonus — elles renforcent le setup mais ne sont pas bloquantes.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {bonus.map(c => {
              const checked = checkedIds.has(c.id);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, background: checked ? "rgba(184,134,11,.04)" : "var(--card)", border: `1px solid ${checked ? "rgba(184,134,11,.25)" : "var(--border)"}`, borderRadius: 10, padding: "12px 16px", transition: "all .15s" }}>
                  <button onClick={() => toggleCheck(c.id)}
                    style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? "var(--a)" : "var(--border)"}`, background: checked ? "var(--a)" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: checked ? "var(--a)" : "var(--ink)" }}>{c.titre}</div>
                    {c.description && <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>{c.description}</div>}
                  </div>
                  <button onClick={() => deleteConfluence(c.id)}
                    style={{ background: "none", border: "none", color: "var(--ink3)", cursor: "pointer", padding: "4px", fontSize: 14, lineHeight: 1, opacity: 0.4 }}
                    onMouseOver={e => (e.currentTarget.style.opacity = "1")}
                    onMouseOut={e => (e.currentTarget.style.opacity = "0.4")}>
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Formulaire ajout */}
      {showForm ? (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>Nouvelle confluence</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 6 }}>Titre *</label>
            <input
              value={form.titre}
              onChange={e => setForm({ ...form, titre: e.target.value })}
              placeholder="Ex: Structure de marché en accord avec le trade"
              style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 6 }}>Description (optionnel)</label>
            <input
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Précision supplémentaire..."
              style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["required", "bonus"] as const).map(t => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  style={{ padding: "7px 18px", borderRadius: 7, border: `1.5px solid ${form.type === t ? "var(--navy)" : "var(--border)"}`, background: form.type === t ? "var(--tint-n-bg)" : "var(--bg2)", color: form.type === t ? "var(--navy)" : "var(--ink2)", fontSize: 13, fontWeight: form.type === t ? 700 : 500, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  {t === "required" ? "Obligatoire" : "Bonus"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowForm(false)}
              style={{ padding: "9px 18px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--ink2)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Annuler
            </button>
            <button onClick={addConfluence} disabled={saving || !form.titre.trim()}
              style={{ padding: "9px 24px", borderRadius: 7, border: "none", background: "var(--navy)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving || !form.titre.trim() ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: saving || !form.titre.trim() ? 0.5 : 1 }}>
              {saving ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--ink3)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", transition: "all .15s", marginBottom: 32 }}
          onMouseOver={e => { (e.currentTarget).style.borderColor = "var(--navy)"; (e.currentTarget).style.color = "var(--navy)"; }}
          onMouseOut={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--ink3)"; }}>
          + Ajouter une confluence
        </button>
      )}

      {/* Check pré-trade interactif */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Check pré-trade</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>{ptQuestions.length} question{ptQuestions.length > 1 ? "s" : ""} — réponds honnêtement avant chaque entrée</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {ptDone && (
              <button onClick={ptStartQuiz}
                style={{ fontSize: 12, color: "var(--ink3)", background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                Refaire
              </button>
            )}
            <button onClick={() => { setPtManage(!ptManage); setPtStep(null); setPtDone(false); }}
              style={{ fontSize: 12, color: ptManage ? "var(--navy)" : "var(--ink3)", background: ptManage ? "var(--tint-n-bg)" : "none", border: `1px solid ${ptManage ? "var(--tint-n-border)" : "var(--border)"}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "var(--font-outfit)", fontWeight: ptManage ? 700 : 400 }}>
              {ptManage ? "← Fermer" : "Gérer"}
            </button>
          </div>
        </div>

        {/* Mode gestion */}
        {ptManage && (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {ptQuestions.map((q, i) => (
                <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: "var(--bg2)", borderRadius: 9, border: "1px solid var(--border)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{q.q}</div>
                    {q.detail && <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 3, lineHeight: 1.5 }}>{q.detail}</div>}
                  </div>
                  <button onClick={() => ptDeleteQuestion(q.id)}
                    style={{ background: "none", border: "none", color: "var(--r)", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: "2px 4px", opacity: 0.55, flexShrink: 0 }}
                    onMouseOver={e => (e.currentTarget.style.opacity = "1")}
                    onMouseOut={e => (e.currentTarget.style.opacity = "0.55")}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            {ptAddingQ ? (
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 9, padding: "14px 16px" }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 5 }}>Question *</label>
                  <input
                    value={ptNewQ}
                    onChange={e => setPtNewQ(e.target.value)}
                    placeholder="Ex: Le volume est-il en accord avec mon setup ?"
                    autoFocus
                    style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 11px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 5 }}>Précision (optionnel)</label>
                  <input
                    value={ptNewDetail}
                    onChange={e => setPtNewDetail(e.target.value)}
                    placeholder="Explication courte pour t'aider à répondre..."
                    style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 11px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setPtAddingQ(false); setPtNewQ(""); setPtNewDetail(""); }}
                    style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--ink3)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    Annuler
                  </button>
                  <button onClick={ptAddQuestion} disabled={!ptNewQ.trim()}
                    style={{ padding: "7px 18px", borderRadius: 6, border: "none", background: "var(--navy)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: ptNewQ.trim() ? "pointer" : "not-allowed", fontFamily: "var(--font-outfit)", opacity: ptNewQ.trim() ? 1 : 0.5 }}>
                    Ajouter
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setPtAddingQ(true)}
                style={{ width: "100%", padding: "10px", borderRadius: 9, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--ink3)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}
                onMouseOver={e => { (e.currentTarget).style.borderColor = "var(--navy)"; (e.currentTarget).style.color = "var(--navy)"; }}
                onMouseOut={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--ink3)"; }}>
                + Ajouter une question personnalisée
              </button>
            )}
          </div>
        )}

        {/* Quiz step-by-step */}
        {!ptManage && ptStep !== null && !ptDone && (() => {
          const q = ptQuestions[ptStep];
          if (!q) return null;
          return (
            <div style={{ padding: "24px 28px" }}>
              {/* Progress bar */}
              <div style={{ display: "flex", gap: 5, marginBottom: 22 }}>
                {ptQuestions.map((pq, i) => {
                  const ans = ptAnswers[pq.id];
                  const bg = ans === "oui" ? "var(--g)" : ans === "non" ? "var(--r)" : i === ptStep ? "var(--navy)" : "var(--bg3)";
                  return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: bg, opacity: i === ptStep && !ans ? 0.5 : 1, transition: "background .2s" }} />;
                })}
              </div>

              <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 8, fontWeight: 600 }}>
                Question {ptStep + 1} sur {ptQuestions.length}
              </div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 19, color: "var(--ink)", lineHeight: 1.35, marginBottom: 10 }}>
                {q.q}
              </div>
              {q.detail && (
                <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.65, marginBottom: 28, padding: "10px 14px", background: "var(--bg2)", borderRadius: 8, borderLeft: "3px solid var(--border)" }}>
                  {q.detail}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <button onClick={() => ptAnswer(q.id, "oui")}
                  style={{ flex: 1, padding: "14px", borderRadius: 10, border: "2px solid var(--tint-g-border)", background: "var(--tint-g-bg)", color: "var(--g)", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", transition: "all .15s" }}
                  onMouseOver={e => { (e.currentTarget).style.opacity = "0.8"; }}
                  onMouseOut={e => { (e.currentTarget).style.opacity = "1"; }}>
                  ✓ Oui
                </button>
                <button onClick={() => ptAnswer(q.id, "non")}
                  style={{ flex: 1, padding: "14px", borderRadius: 10, border: "2px solid var(--tint-r-border)", background: "var(--tint-r-bg)", color: "var(--r)", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", transition: "all .15s" }}
                  onMouseOver={e => { (e.currentTarget).style.opacity = "0.8"; }}
                  onMouseOut={e => { (e.currentTarget).style.opacity = "1"; }}>
                  ✗ Non
                </button>
              </div>

              {ptStep > 0 && (
                <button onClick={ptGoPrev}
                  style={{ background: "none", border: "none", color: "var(--ink3)", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "var(--font-outfit)" }}>
                  ← Question précédente
                </button>
              )}
            </div>
          );
        })()}

        {/* Landing — pas encore commencé */}
        {!ptManage && ptStep === null && !ptDone && (
          <div style={{ padding: "28px", textAlign: "center" }}>
            <div style={{ fontSize: 30, marginBottom: 12 }}>🎯</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, color: "var(--ink)", marginBottom: 8 }}>Prêt à entrer en trade ?</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 22, lineHeight: 1.6, maxWidth: 360, margin: "0 auto 22px" }}>
              Réponds à {ptQuestions.length} questions pour valider ton setup. Honnêteté totale — personne ne regarde.
            </div>
            {ptQuestions.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--ink3)", background: "var(--bg2)", borderRadius: 8, padding: "10px 16px", display: "inline-block" }}>
                Ajoute des questions via "Gérer" ↗
              </div>
            ) : (
              <button onClick={ptStartQuiz}
                style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 9, padding: "12px 32px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                Démarrer le check →
              </button>
            )}
          </div>
        )}

        {/* Résultat */}
        {!ptManage && ptDone && ptVerdict && (
          <div style={{ padding: "24px 28px" }}>
            {/* Verdict principal */}
            <div style={{ background: ptVerdict.bg, border: `1px solid ${ptVerdict.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 22 }}>
                {ptNonCount === 0 ? "✅" : ptNonCount <= 1 ? "⚠️" : "🚫"}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: ptVerdict.color, marginBottom: 3 }}>{ptVerdict.label}</div>
                <div style={{ fontSize: 12, color: "var(--ink3)" }}>{ptVerdict.sub}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: ptVerdict.color, lineHeight: 1 }}>{ptOuiCount}/{ptTotal}</div>
                <div style={{ fontSize: 10, color: "var(--ink3)" }}>validées</div>
              </div>
            </div>

            {/* Détail question par question */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {ptQuestions.map((q, i) => {
                const ans = ptAnswers[q.id];
                const isOui = ans === "oui";
                return (
                  <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: isOui ? "var(--tint-g-bg)" : "var(--tint-r-bg)", borderRadius: 8, border: `1px solid ${isOui ? "var(--tint-g-border)" : "var(--tint-r-border)"}` }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: isOui ? "var(--g)" : "var(--r)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>{isOui ? "✓" : "✗"}</span>
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: "var(--ink2)", fontWeight: isOui ? 400 : 600 }}>{q.q}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isOui ? "var(--g)" : "var(--r)" }}>{isOui ? "Oui" : "Non"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Comment construire ton plan */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Comment construire ton plan de trading</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            {
              step: "1",
              title: "Contexte de marché",
              desc: "Identifie dans quel environnement tu opères : tendance, range, ou retournement. Que tu trades dans le sens du flux ou en inversion, ton setup doit être cohérent avec ta lecture du contexte.",
              color: "var(--navy)",
            },
            {
              step: "2",
              title: "Zone de valeur",
              desc: "Repère les niveaux clés pertinents pour ta stratégie : supports/résistances, zones de liquidité, niveaux institutionnels. Entre uniquement quand le prix est sur une zone qui a du sens.",
              color: "var(--gold)",
            },
            {
              step: "3",
              title: "Confirmation d'entrée",
              desc: "Attends une confirmation adaptée à ta stratégie avant d'entrer. Peu importe la méthode — ne trade jamais une anticipation non confirmée. Le marché te donnera toujours une occasion de valider.",
              color: "var(--g)",
            },
            {
              step: "4",
              title: "Ratio risque/récompense",
              desc: "Calcule ton RR avant chaque entrée et compare-le à ton seuil minimum. Ce seuil dépend de ton style — connais-le. S'il n'est pas atteint, ne trade pas.",
              color: "var(--a)",
            },
          ].map((item, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>{item.step}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{item.title}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
