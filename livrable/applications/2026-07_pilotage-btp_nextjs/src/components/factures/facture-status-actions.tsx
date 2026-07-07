"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { updateFactureStatus } from "@/lib/actions/factures"
import type { FactureStatusValue } from "@/lib/validations/factures"

export function FactureStatusActions({
  factureId,
  status,
}: {
  factureId: string
  status: FactureStatusValue
}) {
  const [isPending, startTransition] = useTransition()

  const setStatus = (next: FactureStatusValue) => {
    startTransition(async () => {
      await updateFactureStatus(factureId, next)
    })
  }

  if (status === "brouillon") {
    return (
      <Button disabled={isPending} onClick={() => setStatus("envoyee")}>
        Marquer comme envoyée
      </Button>
    )
  }

  if (status === "envoyee" || status === "en_retard") {
    return (
      <Button variant="outline" disabled={isPending} onClick={() => setStatus("annulee")}>
        Annuler la facture
      </Button>
    )
  }

  return null
}
