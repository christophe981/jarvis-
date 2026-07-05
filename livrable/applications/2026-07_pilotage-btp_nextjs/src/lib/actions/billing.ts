"use server"

import { redirect } from "next/navigation"

import { getActiveOrg } from "@/lib/supabase/org"
import { getStripeClient } from "@/lib/stripe/client"

export async function createCheckoutSession() {
  const { supabase, orgId, userId } = await getActiveOrg()
  if (!orgId || !userId) return { error: "Organisation introuvable" }

  const priceId = process.env.STRIPE_PRICE_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!priceId || !siteUrl) return { error: "Configuration Stripe incomplète" }

  const stripe = getStripeClient()

  const { data: org } = await supabase.from("organizations").select("name").eq("id", orgId).single()
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("org_id", orgId)
    .maybeSingle()

  let customerId = existing?.stripe_customer_id ?? null

  if (!customerId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const customer = await stripe.customers.create({
      name: org?.name ?? undefined,
      email: user?.email ?? undefined,
      metadata: { org_id: orgId },
    })
    customerId = customer.id

    const { error } = await supabase.rpc("upsert_subscription_customer", {
      p_org_id: orgId,
      p_stripe_customer_id: customerId,
    })
    if (error) return { error: "Impossible d'initialiser l'abonnement" }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/parametres/abonnement?checkout=success`,
    cancel_url: `${siteUrl}/parametres/abonnement?checkout=cancel`,
  })

  if (!session.url) return { error: "Impossible de créer la session de paiement" }

  redirect(session.url)
}

export async function createPortalSession() {
  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return { error: "Configuration incomplète" }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("org_id", orgId)
    .maybeSingle()

  if (!subscription) return { error: "Aucun abonnement trouvé" }

  const stripe = getStripeClient()
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${siteUrl}/parametres/abonnement`,
  })

  redirect(session.url)
}
