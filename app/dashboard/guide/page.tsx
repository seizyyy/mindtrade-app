"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const sections = [
  {
    id: "settings",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
    color: "var(--gold)",
    tintBg: "rgba(212,168,50,.08)",
    tintBorder: "rgba(212,168,50,.25)",
    title: "Paramètres — commence ici",
    subtitle: "Configure ton compte avant tout le reste",
    steps: [
      { label: "Ton capital et ta devise", desc: "Renseigne la taille de ton compte et ta devise (EUR, USD, CHF, etc.). Cela permet d'afficher tes P&L en pourcentage du capital partout dans l'app." },
      { label: "Ton marché principal", desc: "Forex, Indices, Crypto, Actions... Ce choix adapte l'app à ton trading. Les traders crypto ont accès au check-in 7j/7 — les marchés crypto ne ferment jamais." },
      { label: "Tes limites de risque", desc: "Perte journalière maximum et risque par trade. MindTrade te prévient automatiquement quand tu approches ou dépasses ces seuils pendant ta session." },
      { label: "Ton objectif mensuel", desc: "Définis un objectif en % de ton capital. Une barre de progression sur le dashboard te montre où tu en es chaque jour du mois." },
    ],
    tip: "Sans capital configuré, les P&L s'affichent uniquement en valeur absolue. Avec capital, tu vois aussi le % — bien plus utile pour évaluer tes performances réelles.",
  },
  {
    id: "checkin",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>
      </svg>
    ),
    color: "var(--navy)",
    tintBg: "var(--tint-n-bg)",
    tintBorder: "var(--tint-n-border)",
    title: "Check-in mental",
    subtitle: "À faire chaque matin avant d'ouvrir tes charts",
    steps: [
      { label: "Réponds aux 5 questions", desc: "Sommeil, énergie, concentration, stress, confiance. Sois honnête — personne d'autre ne voit tes réponses. 2 minutes suffisent." },
      { label: "Reçois ton score (0–100)", desc: "MindTrade calcule ton état mental du jour. ≥75 = optimal, 60–74 = attention requise, <60 = évite de trader." },
      { label: "Lis le signal de session", desc: "Feu tricolore basé sur ton score et tes pertes récentes : GO (trade normalement), CAUTION (réduis le risque), STOP (ne trade pas aujourd'hui)." },
    ],
    tip: "Le week-end, le check-in est désactivé pour les marchés fermés (Forex, Indices, etc.). Le dashboard affiche un message pour réviser la semaine et préparer la suivante.",
  },
  {
    id: "confluences",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    color: "var(--g)",
    tintBg: "var(--tint-g-bg)",
    tintBorder: "var(--tint-g-border)",
    title: "Confluences",
    subtitle: "Valide ton setup avant d'entrer en position",
    steps: [
      { label: "Configure tes confluences", desc: "Ajoute tes critères d'entrée personnels : structure de marché, zone de valeur, confirmation de timeframe, volume... Chaque trader a les siens." },
      { label: "Définis ton minimum pour trader", desc: "Règle le seuil avec le stepper +/−. Par défaut à 4 — tu peux l'ajuster selon ton style. Ce réglage est sauvegardé sur ton compte." },
      { label: "Coche avant chaque entrée", desc: "Le score monte au fur et à mesure que tu coches. Vert = minimum atteint, tu peux entrer. Rouge = pas assez de confluences, attends." },
    ],
    tip: "Utilise cet outil avant chaque entrée, pas après. L'objectif est de te forcer à rationaliser avant que l'émotion ne décide à ta place.",
  },
  {
    id: "trades",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    color: "var(--g)",
    tintBg: "var(--tint-g-bg)",
    tintBorder: "var(--tint-g-border)",
    title: "Log de trades",
    subtitle: "Enregistre chaque trade dès qu'il est clôturé",
    steps: [
      { label: "Remplis les champs essentiels", desc: "Paire, direction (LONG/SHORT), P&L dans ta devise, émotion dominante, règles respectées. Chaque champ alimente les analyses." },
      { label: "Suis ton P&L en % du capital", desc: "Si ton capital est configuré dans les paramètres, tu vois automatiquement le % à côté du montant. Les KPIs en haut de page se mettent à jour en temps réel." },
      { label: "Consulte l'analyse par émotion", desc: "En bas de page, MindTrade décompose tes performances par état émotionnel. Tu vois exactement quelles émotions te coûtent le plus." },
    ],
    tip: "Logge même les trades que tu regrettes. Les mauvais trades bien analysés sont plus précieux que les bons trades ignorés.",
  },
  {
    id: "rapport",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    color: "var(--a)",
    tintBg: "var(--tint-a-bg)",
    tintBorder: "var(--tint-a-border)",
    title: "Rapport hebdomadaire",
    subtitle: "Analyse ta semaine — idéalement chaque dimanche",
    steps: [
      { label: "KPIs de la semaine", desc: "P&L net (+ % si capital configuré), win rate, discipline, score mental moyen — tout en un coup d'œil." },
      { label: "Graphique P&L par jour", desc: "Vois quels jours sont rentables et lesquels ne le sont pas. Le graphique est proportionnel — les grandes semaines ne mordent pas sur le bord." },
      { label: "Meilleur trade, pire trade, insights", desc: "MindTrade identifie tes trades extrêmes de la semaine et génère des observations personnalisées basées sur tes données réelles." },
    ],
    tip: "Compare ton P&L selon ton score mental. La plupart des traders découvrent qu'ils perdent quand leur score est sous 65.",
  },
  {
    id: "rapport-mensuel",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    color: "var(--navy)",
    tintBg: "var(--tint-n-bg)",
    tintBorder: "var(--tint-n-border)",
    title: "Rapport mensuel",
    subtitle: "Vue macro de ton mois complet",
    steps: [
      { label: "5 KPIs mensuels", desc: "P&L net, win rate, profit factor, discipline et score mental — calculés sur l'intégralité du mois en cours." },
      { label: "Analyse émotionnelle du mois", desc: "Quelles émotions ont dominé ? Lesquelles t'ont coûté le plus ? Le rapport décompose chaque état et son impact sur tes résultats." },
      { label: "Corrélation score mental / P&L", desc: "Graphique qui met en relation ton état mental moyen et tes résultats par semaine. La corrélation entre psychologie et performance se voit ici." },
    ],
    tip: "Utilise le rapport mensuel en fin de mois pour définir ton objectif du mois suivant. Les patterns se voient mieux sur 30 jours que sur 7.",
  },
  {
    id: "journal",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    color: "var(--navy)",
    tintBg: "var(--tint-n-bg)",
    tintBorder: "var(--tint-n-border)",
    title: "Journal",
    subtitle: "Tes réflexions de séance, privées et indexées",
    steps: [
      { label: "Note ton humeur et ta session", desc: "Humeur, note de séance, ce qui a bien marché, ce qui n'a pas marché. Rapide à remplir, précieux à relire." },
      { label: "Réponds au quiz de réflexion", desc: "5 questions structurées sur ta discipline, tes entrées, ton état émotionnel. Tu peux personnaliser les questions selon tes propres biais identifiés." },
      { label: "Relis tes entrées passées", desc: "Retrouve des patterns dans ta façon de penser. Les erreurs récurrentes apparaissent dans le journal bien avant qu'elles se voient dans les stats." },
    ],
    tip: "3 lignes après chaque séance suffisent. La régularité compte plus que la longueur.",
  },
  {
    id: "alpha",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    color: "var(--gold)",
    tintBg: "rgba(212,168,50,.08)",
    tintBorder: "rgba(212,168,50,.25)",
    title: "MindTrade Alpha — Lifetime exclusif",
    subtitle: "Analyses avancées réservées aux abonnés à vie",
    steps: [
      { label: "Corrélation émotion / performance", desc: "Vois exactement combien chaque état émotionnel te rapporte ou te coûte en moyenne par trade. FOMO, Calme, Confiant, Anxieux — chacun a un impact chiffré sur tes résultats." },
      { label: "Performance par jour de la semaine", desc: "Tes lundis sont-ils rentables ? Tes vendredis catastrophiques ? Alpha détecte tes jours forts et faibles sur l'historique complet de tes trades." },
      { label: "Signal prédictif du jour", desc: "Basé sur ton historique, Alpha prédit ta performance probable du jour. Si tes jeudis sont structurellement mauvais, tu le sais avant d'ouvrir un seul chart." },
    ],
    tip: "Déjà abonné mensuel ? Tu peux upgrader vers Lifetime à prix réduit — le montant déjà payé est déduit. Un seul paiement, accès à vie.",
    isAlpha: true,
  },
];

export default function GuidePage() {
  const [plan, setPlan] = useState<string>("monthly");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
      if (data?.plan) setPlan(data.plan);
    }
    load();
  }, []);

  const isLifetime = plan === "lifetime";
  const isAnnual = plan === "annual";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 8 }}>Guide</div>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.2 }}>Comment utiliser MindTrade</h1>
        <p style={{ fontSize: 14, color: "var(--ink3)", marginTop: 10, lineHeight: 1.6 }}>
          MindTrade est un outil de discipline mentale pour traders. Chaque fonctionnalité a un rôle précis dans ta routine. Voici comment en tirer le maximum.
        </p>
      </div>

      {/* Commence ici — Paramètres CTA */}
      <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)", borderRadius: 14, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 32, flexShrink: 0 }}>⚙️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Commence par les Paramètres</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.6 }}>
            Configure ton capital, ta devise, ton marché et tes limites de risque. Sans ça, une partie des analyses ne fonctionnent pas correctement.
          </div>
        </div>
        <a href="/dashboard/settings" style={{ flexShrink: 0, background: "#fff", color: "var(--navy)", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Configurer →
        </a>
      </div>

      {/* Routine recommandée */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>Routine recommandée</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: "1", time: "Avant les marchés", action: "Fais ton check-in mental", href: "/dashboard/checkin", color: "var(--navy)" },
            { step: "2", time: "Avant chaque trade", action: "Vérifie tes confluences", href: "/dashboard/confluences", color: "var(--g)" },
            { step: "3", time: "Après chaque trade", action: "Logge dans le journal de trades", href: "/dashboard/trades", color: "var(--g)" },
            { step: "4", time: "En fin de séance", action: "Écris une note dans le journal", href: "/dashboard/journal", color: "var(--navy)" },
            { step: "5", time: "Chaque week-end", action: "Analyse ton rapport hebdo", href: "/dashboard/rapport", color: "var(--a)" },
            { step: "6", time: "Fin de mois", action: "Consulte le rapport mensuel", href: "/dashboard/rapport-mensuel", color: "var(--navy)" },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--bg2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--ink3)", flexShrink: 0 }}>{r.step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 2 }}>{r.time}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{r.action}</div>
              </div>
              <a href={r.href} style={{ fontSize: 12, fontWeight: 700, color: r.color, textDecoration: "none", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", flexShrink: 0 }}>
                Ouvrir →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Sections détaillées */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((s) => (
          (s as any).isAlpha ? (
            /* ── Section Alpha — rendu premium ── */
            <div key={s.id} style={{ background: "linear-gradient(145deg, #0f2744 0%, #1a3a5c 60%, #0f2744 100%)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(212,168,50,.25)", position: "relative" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(212,168,50,.06)", pointerEvents: "none" }} />
              <div style={{ padding: "18px 24px 16px", borderBottom: "1px solid rgba(212,168,50,.15)", display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(212,168,50,.12)", border: "1px solid rgba(212,168,50,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{s.title}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)", background: "rgba(212,168,50,.15)", border: "1px solid rgba(212,168,50,.3)", borderRadius: 20, padding: "2px 8px", textTransform: "uppercase", letterSpacing: ".08em" }}>Lifetime</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{s.subtitle}</div>
                </div>
              </div>
              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
                  {s.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(212,168,50,.12)", border: "1px solid rgba(212,168,50,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{step.label}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.55 }}>{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16, background: "rgba(212,168,50,.06)", border: "1px solid rgba(212,168,50,.2)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.55 }}>{s.tip}</div>
                </div>
                {isLifetime ? (
                  <a href="/dashboard/alpha" style={{ display: "block", textAlign: "center", background: "var(--gold)", color: "#0f2744", padding: "11px", borderRadius: 9, fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: ".01em" }}>
                    Accéder à MindTrade Alpha →
                  </a>
                ) : (
                  <>
                    <div style={{ textAlign: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>
                        {isAnnual ? "Abonné annuel — rabais appliqué sur le Lifetime" : "Abonné mensuel — montant déjà payé déduit"} · Accès immédiat
                      </span>
                    </div>
                    <a href="/dashboard/alpha" style={{ display: "block", textAlign: "center", background: "var(--gold)", color: "#0f2744", padding: "11px", borderRadius: 9, fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: ".01em" }}>
                      Upgrader vers Lifetime et accéder à Alpha →
                    </a>
                  </>
                )}
              </div>
            </div>
          ) : (
          <div key={s.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "18px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.tintBg, border: `1px solid ${s.tintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>{s.subtitle}</div>
              </div>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {s.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.tintBg, border: `1px solid ${s.tintBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: s.color, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{step.label}</div>
                      <div style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.55 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.55 }}>{s.tip}</div>
              </div>
            </div>
          </div>
          )
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ marginTop: 28, background: "var(--tint-n-bg)", border: "1px solid var(--tint-n-border)", borderRadius: 14, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Tout est prêt ?</div>
        <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Commence par configurer tes paramètres, puis fais ton premier check-in. Le reste se débloque naturellement.</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/dashboard/settings" style={{ display: "inline-block", background: "var(--navy)", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Paramètres →
          </a>
          <a href="/dashboard/checkin" style={{ display: "inline-block", background: "var(--bg2)", color: "var(--ink)", border: "1px solid var(--border)", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Check-in →
          </a>
        </div>
      </div>

    </div>
  );
}
