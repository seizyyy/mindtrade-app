"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "C'est quoi MindTrade ?",
  "Quel plan choisir ?",
  "Y a-t-il un essai gratuit ?",
  "Combien de temps par jour ?",
];

type FAQ = { keywords: string[]; answer: string };

const FAQS: FAQ[] = [
  {
    keywords: ["c'est quoi", "kesako", "présente", "présentation", "mindtrade", "quoi mindtrade", "explique"],
    answer: "MindTrade est un copilote mental pour traders. Avant d'ouvrir tes charts, tu fais un check-in de 2 minutes qui calcule ton score mental du jour. L'app détecte tes biais, suit tes trades et génère un rapport hebdo pour que tu progresses réellement.",
  },
  {
    keywords: ["comment ça marche", "fonctionne", "comment utiliser", "comment ça fonctionne", "marche"],
    answer: "C'est simple : chaque matin, check-in en 2 min → score mental + signal mental. Pendant ta session, tu logs tes trades en 30s. En fin de semaine, rapport narratif avec tes patterns. En tout, moins de 10 min/jour.",
  },
  {
    keywords: ["plan", "choisir", "quel abonnement", "différence", "mensuel", "annuel", "lifetime", "lequel"],
    answer: "Si tu veux tester sans engagement → Mensuel à 39€/mois. Si tu es sérieux → Annuel à 290€/an (2 mois offerts, le plus populaire). Si tu veux ne plus y penser → Lifetime à 597€, accès à vie, prix garanti. Les fonctionnalités sont identiques sur les 3 plans.",
  },
  {
    keywords: ["gratuit", "essai", "tester", "sans payer", "free", "trial"],
    answer: "Tu peux faire le check-in mental gratuitement et sans inscription sur /essai-gratuit — 4 questions, 90 secondes, tu vois ton score mental du jour. Pour accéder au dashboard complet (trades, rapport, journal), c'est payant. Mais la garantie remboursement 14 jours fait office d'essai sans risque.",
  },
  {
    keywords: ["temps", "minutes", "long", "rapide", "durée", "combien de temps"],
    answer: "Check-in : 2 minutes. Log d'un trade : 30 secondes. Journal de fin de session : 5 minutes. Total : moins de 10 min/jour. L'impact sur ta performance est bien supérieur au temps investi.",
  },
  {
    keywords: ["broker", "connecter", "import", "mt4", "mt5", "ctrader", "tradingview", "csv"],
    answer: "Aucune connexion broker nécessaire. Tout est en saisie manuelle rapide — 30 secondes par trade. L'import automatique est prévu dans les prochaines versions.",
  },
  {
    keywords: ["marché", "forex", "crypto", "indices", "actions", "futures", "bitcoin", "nasdaq", "or", "xau"],
    answer: "MindTrade fonctionne pour tous les marchés : Forex, crypto, indices (Nasdaq, SP500), actions, futures, Or. La psychologie du trading ne change pas selon l'actif — le FOMO sur EUR/USD est le même que sur Bitcoin.",
  },
  {
    keywords: ["résultat", "ça marche", "efficace", "preuve", "vrai", "vraiment", "performance"],
    answer: "Les traders qui utilisent MindTrade régulièrement constatent moins d'impulsivité, une meilleure consistance et une discipline plus solide. Les résultats varient selon chaque trader — c'est un outil d'aide à la décision, pas une promesse de performance.",
  },
  {
    keywords: ["journal", "différence journal", "autre journal", "notion", "excel", "tradersync"],
    answer: "Un journal classique analyse ce qui s'est passé après coup. MindTrade intervient avant — score mental, signal mental, confluences — pour que tu ne prennes plus de mauvaises décisions dans un mauvais état. C'est préventif, pas rétroactif.",
  },
  {
    keywords: ["rembours", "satisfait", "garantie", "risque", "annuler", "14 jours", "14j"],
    answer: "Garantie remboursement intégral sous 14 jours, sans question. Un email à contact@mindtrade.app suffit. Tu ne prends aucun risque financier.",
  },
  {
    keywords: ["annuler", "résilier", "arrêter", "stopper", "sans engagement"],
    answer: "Le plan mensuel est sans engagement — tu résilie quand tu veux. Pour l'annuel et le lifetime, la garantie 14j s'applique. Après ça, les plans sont engagés sur leur durée.",
  },
  {
    keywords: ["données", "sécurité", "privé", "confidential", "rgpd", "gdpr", "stocke"],
    answer: "Tes données sont hébergées sur Supabase (infrastructure certifiée), les paiements via Stripe (jamais nous n'accédons à tes infos bancaires). Politique de confidentialité disponible sur le site.",
  },
  {
    keywords: ["changer plan", "upgrader", "passer", "changer abonnement", "upgrade"],
    answer: "Oui, tu peux changer de plan à tout moment. Contacte-nous à contact@mindtrade.app et on s'occupe de la migration.",
  },
  {
    keywords: ["score mental", "score", "calculé", "calcul", "comment calculé"],
    answer: "Le score mental (0-100) est calculé depuis 5 indicateurs : sommeil, énergie, focus, stress et confiance. Chaque matin en 2 min. Il est ensuite corrélé automatiquement à tes performances de trading sur 30 jours.",
  },
  {
    keywords: ["signal mental", "biais", "fomo", "revenge", "alerte", "biais détecté"],
    answer: "Le signal mental est calculé depuis ton score du jour + tes derniers trades. Il détecte les risques de revenge trading, FOMO, overconfiance — et t'alerte avant que tu ouvres une position, pas après.",
  },
  {
    keywords: ["confluence", "confluences", "setup", "règle", "critère"],
    answer: "Les confluences sont tes critères d'entrée en trade. Tu les définis toi-même (support clé, tendance, timing…). MindTrade compare le win rate de tes trades avec toutes tes confluences vs ceux pris sans — pour voir concrètement l'impact de ta discipline.",
  },
  {
    keywords: ["mobile", "application", "app", "iphone", "android", "téléphone"],
    answer: "MindTrade est une application web accessible sur mobile via le navigateur. Une app native est prévue dans les prochaines versions.",
  },
  {
    keywords: ["résultats quand", "premiers résultats", "combien semaines", "délai", "progresser"],
    answer: "Les premiers effets (clarté mentale avant la session, moins d'impulsivité) se ressentent dès la première semaine. Les résultats chiffrables sur le win rate apparaissent généralement entre la 3e et la 6e semaine.",
  },
  {
    keywords: ["contact", "support", "aide", "email", "joindre", "parler"],
    answer: "Tu peux nous contacter à contact@mindtrade.app — réponse sous 24h. Pour les abonnés lifetime, réponse garantie sous 24h.",
  },
  {
    keywords: ["prix", "coût", "tarif", "combien", "cher", "€"],
    answer: "Mensuel : 39€/mois (sans engagement). Annuel : 290€/an soit 24€/mois (−38%). Lifetime : 597€ paiement unique, accès à vie. Garantie remboursement 14 jours sur tous les plans.",
  },
  {
    keywords: ["accès", "immédiat", "quand accès", "inscription", "créer compte"],
    answer: "Accès immédiat après le paiement. Aucune liste d'attente, aucune configuration. Tu crées ton compte et tu commences ton premier check-in dans la minute.",
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQS) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq.answer;
    }
  }
  return "Bonne question ! Je n'ai pas la réponse directement, mais tu peux nous écrire à contact@mindtrade.app — on répond sous 24h. Tu peux aussi consulter la FAQ en bas de la page.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: "Bonjour 👋 Je suis l'assistant MindTrade. Pose-moi ta question sur le produit, les tarifs ou le fonctionnement !" }]);
    }
    if (open) setShowDot(false);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function send(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const reply = findAnswer(content);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 600);
  }

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 400, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>

      {open && (
        <div style={{
          width: 340, background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 24px 80px rgba(12,12,10,.18)",
          display: "flex", flexDirection: "column",
          maxHeight: 480,
        }}>
          {/* Header */}
          <div style={{ background: "var(--navy)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧠</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Assistant MindTrade</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", color: "rgba(255,255,255,.7)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10, minHeight: 200 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "9px 13px",
                  borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: m.role === "user" ? "var(--navy)" : "var(--bg2)",
                  border: m.role === "user" ? "none" : "1px solid var(--border)",
                  fontSize: 13, color: m.role === "user" ? "#fff" : "var(--ink)", lineHeight: 1.6,
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink3)", animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions — uniquement au début */}
            {messages.length === 1 && !loading && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    style={{ padding: "6px 12px", borderRadius: 20, border: "1.5px solid var(--border)", background: "var(--card)", fontSize: 12, fontWeight: 500, color: "var(--ink2)", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Pose ta question…"
              style={{ flex: 1, background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-outfit)", color: "var(--ink)", outline: "none" }}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, opacity: !input.trim() || loading ? 0.4 : 1, flexShrink: 0 }}>
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button onClick={() => setOpen(o => !o)} style={{
        width: 52, height: 52, borderRadius: "50%",
        background: open ? "var(--bg3)" : "var(--navy)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, boxShadow: "0 4px 24px rgba(15,39,68,.3)",
        transition: "all .2s", position: "relative",
      }}>
        {open ? "×" : "💬"}
        {showDot && !open && (
          <div style={{ position: "absolute", top: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#4ade80", border: "2px solid var(--bg)", fontSize: 7, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>1</div>
        )}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
