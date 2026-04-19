"use client";


const planFeatures = {
  monthly: [
    "Check-in quotidien + score mental",
    "Dashboard complet + signal mental",
    "Log de trades + confluences",
    "Rapport hebdomadaire",
    "Journal structuré + quiz de réflexion",
    "Sans engagement · Résiliable à tout moment",
  ],
  annual: [
    "Toutes les fonctionnalités incluses (hors Alpha)",
    "2 mois offerts — économie de 178€ vs mensuel",
    "Accès prioritaire aux nouvelles fonctionnalités",
    "Support réponse sous 48h",
  ],
  lifetime: [
    "Tout le plan annuel inclus, à vie",
    "★ Alpha — signal prédictif du jour, profil trader, corrélations mental/P&L, impact discipline, émotions en chiffres, performance par paire & par jour",
    "Toutes les futures fonctionnalités incluses",
    "Accès prioritaire aux nouvelles features",
    "Support direct — réponse sous 24h",
  ],
};

function Check({ dark }: { dark: boolean }) {
  return (
    <div style={{ width: 16, height: 16, borderRadius: "50%", background: dark ? "rgba(22,101,52,.3)" : "rgba(22,101,52,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, fontSize: 9, color: dark ? "#4ade80" : "var(--g)", fontWeight: 700 }}>✓</div>
  );
}

function FeatureItem({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: dark ? "rgba(255,255,255,.65)" : "var(--ink2)", lineHeight: 1.5 }}>
      <Check dark={dark} />
      {text}
    </div>
  );
}



export default function Pricing() {
  return (
    <section id="acces" style={{ padding: "96px 5%", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Tarifs</div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff", marginBottom: 16 }}>
            Un mauvais trade évité.<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.5)" }}>L{"'"}outil est déjà remboursé.</em>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", maxWidth: 480, margin: "0 auto" }}>
            Le trader moyen perd 300€ sur un seul trade émotionnel. MindTrade coûte moins que ça par an.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr 1fr", gap: 16, alignItems: "stretch" }}>

          {/* Mensuel */}
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 24 }}>Mensuel</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>39€</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.35)", marginBottom: 8, paddingBottom: 2 }}>/mois</div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)", marginBottom: 32 }}>soit 1,30€/jour · Sans engagement</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 36, flex: 1 }}>
              {planFeatures.monthly.map(f => <FeatureItem key={f} text={f} dark={true} />)}
            </div>
            <a href="/register?plan=monthly" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)", background: "transparent", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.55)" }}>
              Choisir le mensuel →
            </a>
          </div>

          {/* Annuel — FEATURED */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "48px 36px 40px", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 0 0 1px rgba(255,255,255,.1), 0 40px 100px rgba(0,0,0,.5)" }}>
            <div style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, var(--navy), var(--navy2))", color: "#fff", fontSize: 11, fontWeight: 800, padding: "6px 18px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: ".06em", boxShadow: "0 4px 16px rgba(15,39,68,.4)" }}>
              LE PLUS POPULAIRE
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 24 }}>Annuel</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 6 }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 48, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>290€</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 8, paddingBottom: 2 }}>/an</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
              <span style={{ fontSize: 13, color: "var(--ink3)", textDecoration: "line-through" }}>468€</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--g)", background: "rgba(22,101,52,.08)", border: "1px solid rgba(22,101,52,.15)", padding: "2px 9px", borderRadius: 20 }}>−38% · 2 mois offerts</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 36, flex: 1 }}>
              {planFeatures.annual.map(f => <FeatureItem key={f} text={f} dark={false} />)}
            </div>
            <a href="/register?plan=annual" style={{ display: "block", textAlign: "center", padding: "15px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)", background: "var(--ink)", color: "#fff" }}>
              Démarrer maintenant →
            </a>
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink3)", marginTop: 10 }}>soit 24€/mois · Remboursé 14j</div>
          </div>

          {/* Lifetime — PREMIUM */}
          <div style={{ background: "linear-gradient(160deg, rgba(184,134,11,.12), rgba(184,134,11,.04))", border: "1px solid rgba(184,134,11,.3)", borderRadius: 16, padding: "36px 32px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, background: "radial-gradient(circle, rgba(184,134,11,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em" }}>Lifetime</div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "var(--gold)", background: "rgba(184,134,11,.12)", border: "1px solid rgba(184,134,11,.35)", padding: "3px 10px", borderRadius: 20, letterSpacing: ".04em" }}>EXCLUSIF</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>597€</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginBottom: 4 }}>Paiement unique · Accès à vie</div>

            <div style={{ marginBottom: 24, marginTop: 4, background: "rgba(184,134,11,.08)", border: "1px solid rgba(184,134,11,.2)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Sur 3 ans, tu économises</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>Annuel × 3 ans</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.35)", textDecoration: "line-through" }}>870€</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>Lifetime</span>
                <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700 }}>597€ · une fois</span>
              </div>
              <div style={{ height: 1, background: "rgba(184,134,11,.2)", marginBottom: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Tu économises</span>
                <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>273€</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28, flex: 1 }}>
              {planFeatures.lifetime.map((f, i) => (
                <div key={f}>
                  <FeatureItem text={f} dark={true} />
                  {i === 1 && (
                    <div style={{ fontSize: 11, color: "rgba(184,134,11,.7)", marginLeft: 25, marginTop: 3, fontStyle: "italic" }}>
                      Exclusif Lifetime — tableau de bord comportemental
                    </div>
                  )}
                </div>
              ))}
            </div>

            <a href="/register?plan=lifetime" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)", background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#fff", boxShadow: "0 4px 20px rgba(184,134,11,.3)" }}>
              Accès à vie →
            </a>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36, marginTop: 44, flexWrap: "wrap" }}>
          {[
            { icon: "🔒", text: "Paiement sécurisé Stripe" },
            { icon: "↩", text: "Remboursé 14j sans question" },
            { icon: "⚡", text: "Accès immédiat après paiement" },
            { icon: "🚫", text: "Sans engagement (mensuel)" },
          ].map(t => (
            <div key={t.text} style={{ fontSize: 12, color: "rgba(255,255,255,.3)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{t.icon}</span>{t.text}
            </div>
          ))}
        </div>

        {/* Check-in gratuit — mise en avant */}
        <div style={{
          marginTop: 48,
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 16,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                Pas encore convaincu ?
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", lineHeight: 1.6, maxWidth: 480 }}>
                Teste le check-in mental gratuitement — 4 questions, 90 secondes, aucune inscription. Tu vois immédiatement si l'approche te parle.
              </div>
            </div>
          </div>
          <a href="/essai-gratuit" style={{
            flexShrink: 0,
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.2)",
            color: "#fff",
            padding: "11px 24px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "var(--font-outfit)",
            whiteSpace: "nowrap",
            transition: "background .15s",
          }}
            onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,.18)")}
            onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,.1)")}
          >
            Faire le check-in gratuit →
          </a>
        </div>

      </div>
    </section>
  );
}
