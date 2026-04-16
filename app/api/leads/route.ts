import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("leads")
      .upsert({ email: email.toLowerCase().trim(), source, created_at: new Date().toISOString() }, { onConflict: "email" });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("leads route error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
