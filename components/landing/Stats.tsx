const stats = [
  { value: "312", label: "traders actifs" },
  { value: "+27%", label: "win rate moyen après 30j" },
  { value: "89%", label: "de complétion des check-ins" },
  { value: "4.9/5", label: "satisfaction · 94 avis" },
  { value: "< 10min", label: "par jour" },
];

export default function Stats() {
  return (
    <div style={{
      background: "var(--bg2)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "28px 5%",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 24,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, fontWeight: 700, color: "var(--navy)", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
