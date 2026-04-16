import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json({ error: "Not paid" }, { status: 400 });
    }

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await supabase
        .from("profiles")
        .update({ plan, plan_active: true, stripe_customer_id: session.customer as string })
        .eq("id", userId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
