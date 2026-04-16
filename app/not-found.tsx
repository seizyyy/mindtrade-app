export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit)", background: "var(--bg)", color: "var(--ink)" }}>
      <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 96, fontWeight: 700, color: "var(--ink3)", lineHeight: 1, marginBottom: 16 }}>404</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Page introuvable</div>
        <p style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.6, marginBottom: 32 }}>
          Cette page n{"'"}existe pas ou a été déplacée.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <a href="/" style={{ padding: "11px 24px", borderRadius: 8, background: "var(--navy)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            Retour à l{"'"}accueil
          </a>
          <a href="/dashboard" style={{ padding: "11px 24px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--ink)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            Mon dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
