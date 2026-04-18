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
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const plan = session.metadata?.plan;
    const userId = session.metadata?.userId;

    if (userId && plan) {
      const resolvedPlan = plan.startsWith("upgrade_") ? "lifetime" : plan;
      const customerId = session.customer as string;

      await supabase
        .from("profiles")
        .update({ plan: resolvedPlan, plan_active: true, stripe_customer_id: customerId })
        .eq("id", userId);

      // Si c'est un upgrade, annuler l'abonnement récurrent actif
      if (plan.startsWith("upgrade_") && customerId) {
        const subs = await stripe.subscriptions.list({ customer: customerId, status: "active" });
        for (const sub of subs.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;

    await supabase
      .from("profiles")
      .update({ plan: null, plan_active: false })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}
