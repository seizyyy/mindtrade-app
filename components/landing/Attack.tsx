const problems = [
  {
    title: "Les journaux classiques",
    desc: "Ils analysent ce qui s'est passé. Tu notes tes erreurs après coup. Tu le sais déjà. Mais le lendemain tu recommences exactement pareil — parce que rien ne t'a arrêté avant d'entrer.",
  },
  {
    title: "Les outils d'analyse",
    desc: "Des centaines de statistiques, des dashboards complexes, des heures de configuration. Tu passes plus de temps à analyser qu'à trader. L'outil est devenu la charge, pas la solution.",
  },
  {
    title: "Les apps \"IA\"",
    desc: "Elles analysent ton CSV et retournent des insights génériques. Elles ne savent pas si tu as mal dormi. Elles ne voient pas ton état avant la session. L'IA sans données psychologiques, c'est de la décoration.",
  },
];

const mindtradePoints = [
  { strong: "Score mental avant d'ouvrir les charts.", rest: " Tu sais en 2 minutes si tu es en état de trader ou pas. Pas une analyse post-mortem — une décision préventive." },
  { strong: "Signal mental en temps réel.", rest: " Calculé depuis ton check-in + tes derniers trades. \"Risque de revenge trading élevé\" s'affiche avant que tu ouvres une position." },
  { strong: "Score de discipline distinct du score mental.", rest: " Tu peux te sentir bien et être indiscipliné. Ce sont deux choses différentes. Personne d'autre ne fait cette distinction." },
  { strong: "Confluences corrélées au win rate.", rest: " MindTrade calcule automatiquement la différence de performance entre tes trades avec et sans toutes tes confluences." },
  { strong: "Accès immédiat.", rest: " Pas de liste d'attente, pas de processus compliqué. Tu paies, tu accèdes, tu commences à trader mieux dès aujourd'hui." },
];

const vsRows: [string, ...(boolean | string)[]][] = [
  ["Check-in mental quotidien",       true, false,      false,         false],
  ["Score mental calculé avant session", true, false,   false,         false],
  ["Signal mental en temps réel",   true, false,      false,         "~ partiel"],
  ["Score de discipline distinct",    true, false,      false,         false],
  ["Règles personnelles + suivi",     true, true,       "~ basique",   false],
  ["Confluences corrélées win rate",  true, false,      false,         false],
  ["Journal structuré",               true, true,       true,          true],
  ["Design clair · Simple à utiliser",true, false,      true,          "~ correct"],
  ["Accès immédiat sans friction",    true, false,      false,         false],
];

function Cell({ val }: { val: boolean | string }) {
  if (val === true) return <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, color: "var(--g)", background: "rgba(15,39,68,.04)", borderBottom: "1px solid var(--border)" }}>✓</td>;
  if (val === false) return <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--r)", borderBottom: "1px solid var(--border)" }}>✗</td>;
  return <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--a)", borderBottom: "1px solid var(--border)" }}>{val}</td>;
}

export default function Attack() {
  return (
    <>
      <section id="comparaison" style={{ padding: "96px 5%", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Ce que le marché rate</div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 56 }}>
            Tous les outils analysent.<br />Aucun n{"'"}intervient <em style={{ fontStyle: "italic" }}>avant.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* Problèmes génériques */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {problems.map((p, i) => (
                <div key={i} style={{ padding: "24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.65 }}>{p.desc}</div>
                </div>
              ))}
            </div>

            {/* MindTrade avantages */}
            <div style={{ background: "var(--navy)", borderRadius: 16, padding: 36, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: 20, fontFamily: "var(--font-fraunces)", fontSize: 120, fontWeight: 700, color: "rgba(255,255,255,.04)", lineHeight: 1, pointerEvents: "none" }}>VS</div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, color: "#fff", marginBottom: 24, lineHeight: 1.2 }}>MindTrade fait ce qu{"'"}aucun autre ne fait</div>
              {mindtradePoints.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(22,101,52,.3)", border: "1px solid rgba(22,101,52,.4)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, fontSize: 11, color: "#4ade80", fontWeight: 700 }}>✓</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)", lineHeight: 1.6 }}><strong style={{ color: "#fff" }}>{p.strong}</strong>{p.rest}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VS TABLE — colonnes anonymisées */}
      <section style={{ padding: "0 5% 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", borderBottom: "2px solid var(--border)" }}>Fonctionnalité clé</th>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.9)", background: "var(--navy)", borderRadius: "12px 12px 0 0" }}>MindTrade</th>
                {["Journal classique", "App d'analyse", "Outil tout-en-un", "App IA"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".1em", borderBottom: "2px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vsRows.map(([label, ...vals], ri) => (
                <tr key={ri}>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500, color: "var(--ink2)", borderBottom: "1px solid var(--border)" }}>{label}</td>
                  {(vals as (boolean | string)[]).map((v, ci) => <Cell key={ci} val={v} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
