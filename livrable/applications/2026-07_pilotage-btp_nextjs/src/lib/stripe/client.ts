import Stripe from "stripe"

let stripeClient: Stripe | null = null

export function getStripeClient() {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY manquant")
    stripeClient = new Stripe(secretKey)
  }
  return stripeClient
}
