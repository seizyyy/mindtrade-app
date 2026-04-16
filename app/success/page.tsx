"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Activation de ton accès...");

  useEffect(() => {
    if (!sessionId) { router.replace("/"); return; }

    (async () => {
      try {
        const res = await fetch("/api/stripe/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          setStatus("Accès activé ! Redirection...");
          setTimeout(() => router.replace("/dashboard"), 1000);
        } else {
          setStatus("Connexion requise...");
          setTimeout(() => router.replace("/login?paid=1"), 1500);
        }
      } catch {
        router.replace("/login?paid=1");
      }
    })();
  }, [sessionId]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>🎉</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Paiement confirmé !</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)" }}>{status}</div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
