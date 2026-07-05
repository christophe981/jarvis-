import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { createClient } from "@/lib/supabase/server"
import { getStripeClient } from "@/lib/stripe/client"
import type { SubscriptionStatus } from "@/types/database.types"

async function syncFromSubscription(subscription: Stripe.Subscription) {
  const sharedSecret = process.env.SUPABASE_RPC_SHARED_SECRET
  if (!sharedSecret) throw new Error("SUPABASE_RPC_SHARED_SECRET manquant")

  const supabase = await createClient()
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id
  const periodEnd = subscription.items.data[0]?.current_period_end

  await supabase.rpc("sync_subscription_status", {
    p_stripe_customer_id: customerId,
    p_stripe_subscription_id: subscription.id,
    p_status: subscription.status as SubscriptionStatus,
    p_current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    p_shared_secret: sharedSecret,
  })
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = getStripeClient()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string" ? session.subscription : session.subscription.id
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          await syncFromSubscription(subscription)
        }
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncFromSubscription(event.data.object as Stripe.Subscription)
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error("Erreur webhook Stripe:", err)
    return NextResponse.json({ error: "Erreur de traitement" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
