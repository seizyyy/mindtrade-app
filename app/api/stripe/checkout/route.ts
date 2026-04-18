import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
  lifetime: process.env.STRIPE_PRICE_LIFETIME!,
  upgrade_monthly: process.env.STRIPE_PRICE_UPGRADE_MONTHLY!,
  upgrade_annual: process.env.STRIPE_PRICE_UPGRADE_ANNUAL!,
};

export async function POST(req: NextRequest) {
  try {
    const { plan, email, userId } = await req.json();

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const isRecurring = plan === "monthly" || plan === "annual";

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://www.mindtrade.co/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.mindtrade.co/#acces`,
      metadata: { plan, userId: userId || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
