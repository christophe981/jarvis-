"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { createCheckoutSession, createPortalSession } from "@/lib/actions/billing"

export function SubscribeButton() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <Button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await createCheckoutSession()
            if (result?.error) setError(result.error)
          })
        }
      >
        {isPending ? "Redirection..." : "S'abonner (29 €/mois)"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await createPortalSession()
            if (result?.error) setError(result.error)
          })
        }
      >
        {isPending ? "Redirection..." : "Gérer mon abonnement"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
