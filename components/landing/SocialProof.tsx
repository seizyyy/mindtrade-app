function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= count ? "var(--gold)" : "none"} stroke={i <= count ? "var(--gold)" : "var(--border)"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const reviews = [
  {
    stars: 5,
    initials: "TM", name: "Thomas M.", role: "Day trader · Forex · 4 ans",
    date: "Mars 2026",
    text: "J'utilisais un autre journal depuis 2 ans. MindTrade m'a appris quelque chose qu'aucune stat ne pouvait me donner : savoir quand ne pas trader. En 6 semaines mon win rate est passé de 51% à 65%.",
    featured: true,
  },
  {
    stars: 5,
    initials: "AR", name: "Alexandre R.", role: "Futures · Indices · 6 ans",
    date: "Fév. 2026",
    text: "Avant, je savais que j'étais en tilt seulement après avoir perdu 3 trades de suite. MindTrade me le dit avant d'entrer. C'est la différence entre un miroir et un conseiller.",
    featured: false,
  },
  {
    stars: 5,
    initials: "PK", name: "Pierre K.", role: "Day trader · Forex · 3 ans",
    date: "Janv. 2026",
    text: "Je pensais que mon problème c'était mon système. En réalité c'était mon état mental. Le check-in quotidien m'a forcé à être honnête avec moi-même.",
    featured: false,
  },
  {
    stars: 4,
    initials: "JL", name: "Julie L.", role: "Swing trader · Indices · 2 ans",
    date: "Mars 2026",
    text: "Le score mental avant les charts c'est vraiment utile. J'ai stoppé 3 sessions la semaine dernière avec un score à 52. Interface très propre. J'aurais aimé plus de détails sur les biais mais dans l'ensemble c'est vraiment bien.",
    featured: false,
  },
  {
    stars: 4,
    initials: "MF", name: "Marc F.", role: "Swing trader · Forex · 5 ans",
    date: "Fév. 2026",
    text: "Le journal structuré change vraiment les choses. Je vois exactement pourquoi j'ai perdu et dans quel état j'étais. Seul bémol : l'import automatique depuis mon broker manque encore, mais le support m'a dit que c'est prévu.",
    featured: false,
  },
  {
    stars: 3,
    initials: "SB", name: "Samuel B.", role: "Scalper · Gold · 1 an",
    date: "Fév. 2026",
    text: "J'ai demandé un remboursement au bout de 10 jours. Pas parce que le produit est mauvais — le concept est solide — mais je n'étais tout simplement pas prêt à changer mes habitudes. Le support a traité ça sans aucun problème.",
    featured: false,
  },
];

export default function SocialProof() {
  const featured = reviews[0];
  const rest = reviews.slice(1);

  return (
    <section style={{ padding: "96px 5%", background: "var(--bg2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Avis vérifiés</div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.02em", margin: 0 }}>
              Ce que disent<br />nos traders
            </h2>
          </div>
          {/* Score global */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 24px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 40, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>4.8</div>
              <Stars count={5} />
              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 4 }}>sur 5</div>
            </div>
            <div style={{ width: 1, height: 52, background: "var(--border)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { stars: 5, pct: 72 },
                { stars: 4, pct: 19 },
                { stars: 3, pct: 7 },
                { stars: 2, pct: 2 },
              ].map(r => (
                <div key={r.stars} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 11, color: "var(--ink3)", width: 10, textAlign: "right" }}>{r.stars}</span>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <div style={{ width: 72, height: 4, background: "var(--bg3)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${r.pct}%`, background: r.stars >= 4 ? "var(--gold)" : "var(--ink3)", borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--ink3)" }}>{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured review */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 36px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--navy) 0%, var(--navy2) 100%)" }} />
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 auto 8px" }}>{featured.initials}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{featured.name}</div>
              <div style={{ fontSize: 11, color: "var(--ink3)", maxWidth: 100 }}>{featured.role}</div>
              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{featured.date}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <Stars count={featured.stars} />
              </div>
              <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>
                &ldquo;{featured.text}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Grid 5 avis */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {rest.map((r, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.stars >= 4 ? "var(--navy)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: r.stars >= 4 ? "#fff" : "var(--ink2)", flexShrink: 0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)" }}>{r.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--ink3)", flexShrink: 0 }}>{r.date}</div>
              </div>

              <Stars count={r.stars} />

              <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.7, fontStyle: "italic", margin: "12px 0", flex: 1 }}>
                &ldquo;{r.text}&rdquo;
              </p>

            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 52, marginTop: 44, flexWrap: "wrap" }}>
          {[
            { val: "4.8/5", label: "Note moyenne" },
            { val: "312+", label: "Traders actifs" },
            { val: "+27%", label: "Win rate moyen" },
            { val: "89%", label: "Taux de rétention" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 30, fontWeight: 700, color: "var(--ink)" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
