"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Entry = {
  id: string;
  date: string;
  mood: string;
  session_rating: number;
  good: string | null;
  bad: string | null;
  next_actions: string | null;
  tags: string[] | null;
  quiz_answers: Record<number, string> | null;
};

type Trade = {
  id: string;
  pair: string;
  direction: "LONG" | "SHORT";
  pnl: number;
  emotion: string;
  respected_rules: boolean;
};

const moods = [
  { val: "Serein", emoji: "😌" },
  { val: "Motivé", emoji: "💪" },
  { val: "Neutre", emoji: "😐" },
  { val: "Frustré", emoji: "😤" },
  { val: "Fatigué", emoji: "😴" },
  { val: "Confiant", emoji: "😊" },
];

const TAGS = ["Discipliné", "FOMO", "Revenge", "Profits tôt", "Overconfiant", "Sous-performant"];
const ratings = [1, 2, 3, 4, 5];

const QUIZ_PROMPTS = [
  { icon: "🎯", q: "As-tu respecté l'intégralité de tes règles d'entrée aujourd'hui ?", placeholder: "Décris un moment précis où tu les as respectées ou non..." },
  { icon: "😤", q: "Y a-t-il eu un moment où tu as voulu forcer un trade ou récupérer une perte ? Comment tu as géré ça ?", placeholder: "Sois honnête — même si la réponse est difficile..." },
  { icon: "⏱️", q: "Tes entrées étaient-elles basées sur tes critères, ou sur une envie de trader ?", placeholder: "Décris ta meilleure et ta moins bonne entrée du jour..." },
  { icon: "🧠", q: "Quelle émotion a dominé ta session ? Comment s'est-elle manifestée dans tes décisions ?", placeholder: "Calme, FOMO, sur-confiance, frustration... et son impact concret..." },
  { icon: "📐", q: "Si tu refaisais cette session, qu'est-ce que tu changerais en premier ?", placeholder: "Une chose concrète, pas une généralité..." },
  { icon: "💡", q: "Qu'as-tu appris ou confirmé aujourd'hui que tu vas intégrer demain ?", placeholder: "Un insight concret sur toi-même ou sur le marché..." },
];

export default function JournalPage() {
  const router = useRouter();
  const supabase = createClient();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [todayTrades, setTodayTrades] = useState<Trade[]>([]);
  const [editing, setEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Quiz de réflexion
  const [quizStep, setQuizStep] = useState<number | null>(null); // null = pas commencé
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    mood: "Neutre",
    session_rating: 3,
    good: "",
    bad: "",
    next_actions: "",
    tags: [] as string[],
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }

    const [{ data: journalData }, { data: tradesData }] = await Promise.all([
      supabase.from("journal_entries").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(30),
      supabase.from("trades").select("id,pair,direction,pnl,emotion,respected_rules").eq("user_id", user.id).eq("date", today),
    ]);

    const allEntries = journalData || [];
    setEntries(allEntries);
    setTodayTrades(tradesData || []);

    const te = allEntries.find(e => e.date === today);

    // Charge quiz depuis Supabase en priorité, sinon localStorage
    const supabaseQuiz = te?.quiz_answers;
    if (supabaseQuiz && Object.keys(supabaseQuiz).length > 0) {
      setQuizAnswers(supabaseQuiz);
      if (Object.keys(supabaseQuiz).length >= QUIZ_PROMPTS.length) setQuizDone(true);
    } else {
      const savedQuiz = localStorage.getItem(`mt-quiz-${today}`);
      if (savedQuiz) {
        const parsed = JSON.parse(savedQuiz);
        setQuizAnswers(parsed);
        if (Object.keys(parsed).length >= QUIZ_PROMPTS.length) setQuizDone(true);
      }
    }
    if (te) {
      setTodayEntry(te);
      setForm({
        mood: te.mood || "Neutre",
        session_rating: te.session_rating || 3,
        good: te.good || "",
        bad: te.bad || "",
        next_actions: te.next_actions || "",
        tags: te.tags || [],
      });
    }
    setLoading(false);
  }

  async function saveEntry() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("journal_entries").upsert({
      user_id: user.id,
      date: today,
      mood: form.mood,
      session_rating: form.session_rating,
      good: form.good || null,
      bad: form.bad || null,
      next_actions: form.next_actions || null,
      tags: form.tags.length > 0 ? form.tags : null,
    }, { onConflict: "user_id,date" });

    setSaving(false);
    setEditing(false);
    load();
  }

  async function saveQuizAnswers(answers: Record<number, string>) {
    localStorage.setItem(`mt-quiz-${today}`, JSON.stringify(answers));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("journal_entries").upsert({
      user_id: user.id,
      date: today,
      quiz_answers: answers,
    }, { onConflict: "user_id,date" });
  }

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  }

  const viewEntry = selectedDate ? entries.find(e => e.date === selectedDate) : null;

  if (loading) return <div style={{ color: "var(--ink3)", fontSize: 13 }}>Chargement...</div>;

  const showForm = !todayEntry || editing;
  const todayPnl = todayTrades.reduce((s, t) => s + t.pnl, 0);
  const todayWins = todayTrades.filter(t => t.pnl > 0).length;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 4, fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Journal de trading</div>
      <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 24, fontWeight: 400 }}>Réflexion quotidienne pour progresser sur le long terme.</div>

      {/* Trades du jour */}
      {todayTrades.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>
            Tes trades aujourd{"'"}hui · {todayTrades.length} trade{todayTrades.length > 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
            {todayTrades.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.direction === "LONG" ? "var(--g)" : "var(--r)", background: t.direction === "LONG" ? "var(--tint-g-bg)" : "var(--tint-r-bg)", padding: "2px 7px", borderRadius: 4 }}>{t.direction}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{t.pair}</span>
                  <span style={{ fontSize: 12, color: "var(--ink3)" }}>{t.emotion}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {!t.respected_rules && <span style={{ fontSize: 11, color: "var(--r)", fontWeight: 600 }}>Règles non respectées</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.pnl >= 0 ? "var(--g)" : "var(--r)" }}>
                    {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(0)}€
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, color: "var(--ink3)" }}>{todayWins}W / {todayTrades.length - todayWins}L</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: todayPnl >= 0 ? "var(--g)" : "var(--r)" }}>
              P&L : {todayPnl >= 0 ? "+" : ""}{todayPnl.toFixed(0)}€
            </span>
          </div>
        </div>
      )}

      {/* Formulaire / Entrée du jour */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Entrée du jour</div>
            <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, c => c.toUpperCase())}
            </div>
          </div>
          {todayEntry && !editing && (
            <button onClick={() => setEditing(true)}
              style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--ink2)", fontFamily: "var(--font-outfit)" }}>
              Modifier
            </button>
          )}
        </div>

        {showForm ? (
          <div>
            {/* Mood */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Humeur générale</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {moods.map(m => (
                  <button key={m.val} onClick={() => setForm({ ...form, mood: m.val })}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${form.mood === m.val ? "var(--navy)" : "var(--border)"}`, background: form.mood === m.val ? "var(--tint-n-bg)" : "var(--bg2)", color: form.mood === m.val ? "var(--navy)" : "var(--ink2)", fontSize: 13, fontWeight: form.mood === m.val ? 700 : 500, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    <span>{m.emoji}</span> {m.val}
                  </button>
                ))}
              </div>
            </div>

            {/* Session rating */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Note de la session</div>
              <div style={{ display: "flex", gap: 8 }}>
                {ratings.map(r => (
                  <button key={r} onClick={() => setForm({ ...form, session_rating: r })}
                    style={{ width: 40, height: 40, borderRadius: 8, border: `1.5px solid ${form.session_rating === r ? "var(--navy)" : "var(--border)"}`, background: form.session_rating === r ? "var(--navy)" : "var(--bg2)", color: form.session_rating === r ? "#fff" : "var(--ink3)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-fraunces)" }}>
                    {r}
                  </button>
                ))}
                <span style={{ fontSize: 12, color: "var(--ink3)", alignSelf: "center", marginLeft: 8 }}>
                  {form.session_rating === 5 ? "Excellente" : form.session_rating === 4 ? "Bonne" : form.session_rating === 3 ? "Correcte" : form.session_rating === 2 ? "Difficile" : "Très mauvaise"}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Tags de session</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TAGS.map(tag => {
                  const active = form.tags.includes(tag);
                  const isDanger = ["FOMO", "Revenge", "Overconfiant"].includes(tag);
                  return (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      style={{
                        padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "var(--font-outfit)",
                        border: `1.5px solid ${active ? (isDanger ? "var(--tint-r-border)" : "var(--tint-g-border)") : "var(--border)"}`,
                        background: active ? (isDanger ? "var(--tint-r-bg)" : "var(--tint-g-bg)") : "var(--bg2)",
                        color: active ? (isDanger ? "var(--r)" : "var(--g)") : "var(--ink3)",
                      }}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 sections */}
            {[
              { key: "good", label: "Ce qui s'est bien passé", placeholder: "Discipline respectée, bon timing, lecture du marché précise..." },
              { key: "bad", label: "Ce qui n'a pas fonctionné", placeholder: "Sortie trop tôt, entrée précipitée, non-respect du stop..." },
              { key: "next_actions", label: "Actions pour progresser", placeholder: "Demain je vais..., Cette semaine je travaille sur..." },
            ].map(s => (
              <div key={s.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 6 }}>{s.label}</label>
                <textarea
                  value={form[s.key as keyof typeof form] as string}
                  onChange={e => setForm({ ...form, [s.key]: e.target.value })}
                  placeholder={s.placeholder}
                  rows={3}
                  style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              {editing && (
                <button onClick={() => setEditing(false)}
                  style={{ padding: "10px 20px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--ink2)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Annuler
                </button>
              )}
              <button onClick={saveEntry} disabled={saving}
                style={{ padding: "10px 24px", borderRadius: 7, border: "none", background: "var(--navy)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-outfit)", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Sauvegarde..." : todayEntry ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {moods.find(m => m.val === todayEntry?.mood) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 14px" }}>
                  <span>{moods.find(m => m.val === todayEntry?.mood)?.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{todayEntry?.mood}</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 14px" }}>
                <span style={{ fontSize: 13 }}>{"★".repeat(todayEntry?.session_rating || 0)}{"☆".repeat(5 - (todayEntry?.session_rating || 0))}</span>
                <span style={{ fontSize: 12, color: "var(--ink3)" }}>session</span>
              </div>
              {todayEntry?.tags && todayEntry.tags.length > 0 && todayEntry.tags.map(tag => {
                const isDanger = ["FOMO", "Revenge", "Overconfiant"].includes(tag);
                return (
                  <div key={tag} style={{ display: "flex", alignItems: "center", padding: "5px 12px", background: isDanger ? "var(--tint-r-bg)" : "var(--tint-g-bg)", border: `1px solid ${isDanger ? "var(--tint-r-border)" : "var(--tint-g-border)"}`, borderRadius: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: isDanger ? "var(--r)" : "var(--g)" }}>{tag}</span>
                  </div>
                );
              })}
            </div>
            {[
              { key: "good", label: "Ce qui s'est bien passé" },
              { key: "bad", label: "Ce qui n'a pas fonctionné" },
              { key: "next_actions", label: "Actions pour progresser" },
            ].map(s => todayEntry?.[s.key as keyof Entry] ? (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6, background: "var(--bg2)", borderRadius: 7, padding: "10px 12px" }}>
                  {todayEntry?.[s.key as keyof Entry] as string}
                </div>
              </div>
            ) : null)}
          </div>
        )}
      </div>

      {/* Historique */}
      {entries.filter(e => e.date !== today).length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Historique</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {entries.filter(e => e.date !== today).map(entry => {
              const isSelected = selectedDate === entry.date;
              const moodObj = moods.find(m => m.val === entry.mood);
              return (
                <div key={entry.id}>
                  <button
                    onClick={() => setSelectedDate(isSelected ? null : entry.date)}
                    style={{ width: "100%", background: "var(--card)", border: `1px solid ${isSelected ? "var(--navy)" : "var(--border)"}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-outfit)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{moodObj?.emoji || "😐"}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                            {new Date(entry.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, c => c.toUpperCase())}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 1, display: "flex", gap: 8, alignItems: "center" }}>
                            <span>{entry.mood} · {"★".repeat(entry.session_rating || 0)}</span>
                            {entry.tags && entry.tags.length > 0 && (
                              <span style={{ color: ["FOMO", "Revenge", "Overconfiant"].includes(entry.tags[0]) ? "var(--r)" : "var(--g)", fontWeight: 600 }}>
                                {entry.tags.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--ink3)", transform: isSelected ? "rotate(180deg)" : "none", display: "block", transition: "transform .2s" }}>▾</span>
                    </div>
                  </button>

                  {isSelected && viewEntry && (
                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 16px 16px 44px" }}>
                      {[
                        { key: "good", label: "Bien passé" },
                        { key: "bad", label: "À améliorer" },
                        { key: "next_actions", label: "Actions" },
                      ].map(s => viewEntry[s.key as keyof Entry] ? (
                        <div key={s.key} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>{s.label}</div>
                          <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.5 }}>{viewEntry[s.key as keyof Entry] as string}</div>
                        </div>
                      ) : null)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz de réflexion de fin de session */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Réflexion de fin de session</div>
            <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>6 questions pour ancrer les apprentissages du jour</div>
          </div>
          {quizDone && (
            <button onClick={() => { setQuizDone(false); setQuizStep(0); setCurrentAnswer(quizAnswers[0] || ""); }}
              style={{ fontSize: 11, color: "var(--ink3)", background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Revoir
            </button>
          )}
        </div>

        {/* Pas encore commencé */}
        {quizStep === null && !quizDone && (
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧘</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Prêt pour ta réflexion du jour ?</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 20, lineHeight: 1.6, maxWidth: 380, margin: "0 auto 20px" }}>
              6 questions pour transformer ta session en apprentissage. Prends 5 minutes — c{"'"}est là que le vrai progrès se fait.
            </div>
            <button onClick={() => { setQuizStep(0); setCurrentAnswer(""); }}
              style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Démarrer la réflexion →
            </button>
          </div>
        )}

        {/* Quiz en cours */}
        {quizStep !== null && !quizDone && (() => {
          const step = quizStep as number;
          const prompt = QUIZ_PROMPTS[step];
          const answeredCount = Object.keys(quizAnswers).length;
          function saveAndNext() {
            const updated: Record<number, string> = { ...quizAnswers, [step]: currentAnswer };
            setQuizAnswers(updated);
            if (step < QUIZ_PROMPTS.length - 1) {
              setQuizStep(step + 1);
              setCurrentAnswer(updated[step + 1] || "");
            } else {
              saveQuizAnswers(updated);
              setQuizDone(true);
              setQuizStep(null);
            }
          }
          function goPrev() {
            const updated: Record<number, string> = { ...quizAnswers, [step]: currentAnswer };
            setQuizAnswers(updated);
            setQuizStep(step - 1);
            setCurrentAnswer(updated[step - 1] || "");
          }
          return (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 32px" }}>
              {/* Progress */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {QUIZ_PROMPTS.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? "var(--navy)" : i === step ? "var(--navy)" : "var(--bg3)", opacity: i === step ? 0.45 : 1 }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 6, fontWeight: 600 }}>
                Question {step + 1} sur {QUIZ_PROMPTS.length}
              </div>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{prompt.icon}</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 17, color: "var(--ink)", lineHeight: 1.4, marginBottom: 20 }}>
                {prompt.q}
              </div>
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder={prompt.placeholder}
                rows={4}
                autoFocus
                style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-outfit)", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, outline: "none" }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <button onClick={goPrev} disabled={step === 0}
                  style={{ background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 16px", fontSize: 13, color: "var(--ink3)", cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.3 : 1, fontFamily: "var(--font-outfit)" }}>
                  ← Précédent
                </button>
                <span style={{ fontSize: 11, color: "var(--ink3)" }}>
                  {answeredCount}/{QUIZ_PROMPTS.length} répondues
                </span>
                <button onClick={saveAndNext}
                  style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 7, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  {step < QUIZ_PROMPTS.length - 1 ? "Suivant →" : "Terminer ✓"}
                </button>
              </div>
            </div>
          );
        })()}

        {/* Quiz terminé — résumé */}
        {quizDone && (
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "var(--tint-g-bg)", borderBottom: "1px solid var(--tint-g-border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--g)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>✓</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--g)" }}>Réflexion complétée</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginLeft: "auto" }}>
                {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
              </div>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {QUIZ_PROMPTS.map((p, i) => quizAnswers[i] ? (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{p.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                      Q{i + 1}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--ink3)" }}>· {p.q.length > 60 ? p.q.slice(0, 60) + "…" : p.q}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6, background: "var(--bg2)", borderRadius: 7, padding: "10px 14px" }}>
                    {quizAnswers[i]}
                  </div>
                </div>
              ) : null)}
            </div>
          </div>
        )}
      </div>

      {/* Statistiques de journalisation */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Ta discipline de journalisation</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Entrées ce mois", value: entries.filter(e => e.date.startsWith(new Date().toISOString().slice(0,7))).length, suffix: "" },
            { label: "Sessions ≥4★", value: entries.filter(e => (e.session_rating || 0) >= 4).length, suffix: "" },
            { label: "Jours d'affilée", value: (() => { let streak = 0; const d = new Date(); for (let i = 0; i < 30; i++) { const dt = new Date(d); dt.setDate(dt.getDate() - i); const key = dt.toISOString().split("T")[0]; if (entries.find(e => e.date === key)) streak++; else break; } return streak; })(), suffix: "j" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--navy)", lineHeight: 1 }}>{s.value}{s.suffix}</div>
              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.6, padding: "12px 16px", background: "var(--bg2)", borderRadius: 8 }}>
          <strong style={{ color: "var(--ink2)" }}>Pourquoi journaliser ?</strong> Les traders qui tiennent un journal de trading progressent 3× plus vite que ceux qui ne le font pas. La réflexion quotidienne transforme l{"'"}expérience en apprentissage durable.
        </div>
      </div>
    </div>
  );
}
