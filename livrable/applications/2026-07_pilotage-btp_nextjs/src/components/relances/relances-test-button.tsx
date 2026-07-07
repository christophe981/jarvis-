"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { triggerRelancesNow } from "@/lib/actions/relances"

export function RelancesTestButton() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const onClick = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await triggerRelancesNow()
      if (result?.error) {
        setMessage(`Erreur : ${result.error}`)
        return
      }
      setMessage(
        `${result.devisCount} relance(s) devis envoyée(s), ${result.facturesCount} relance(s) facture envoyée(s)` +
          (result.errors ? `, ${result.errors} échec(s)` : "")
      )
    })
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="outline" disabled={isPending} onClick={onClick}>
        {isPending ? "Envoi en cours..." : "Tester les relances maintenant"}
      </Button>
      {message && <p className="text-[13px] text-brand-muted">{message}</p>}
    </div>
  )
}
