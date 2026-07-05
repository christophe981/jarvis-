"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { updateDevisStatus } from "@/lib/actions/devis"
import type { DevisStatusValue } from "@/lib/validations/devis"

export function DevisStatusActions({
  devisId,
  status,
}: {
  devisId: string
  status: DevisStatusValue
}) {
  const [isPending, startTransition] = useTransition()

  const setStatus = (next: DevisStatusValue) => {
    startTransition(async () => {
      await updateDevisStatus(devisId, next)
    })
  }

  if (status === "brouillon") {
    return (
      <Button disabled={isPending} onClick={() => setStatus("envoye")}>
        Marquer comme envoyé
      </Button>
    )
  }

  if (status === "envoye") {
    return (
      <div className="flex gap-2">
        <Button disabled={isPending} onClick={() => setStatus("accepte")}>
          Marquer accepté
        </Button>
        <Button variant="outline" disabled={isPending} onClick={() => setStatus("refuse")}>
          Marquer refusé
        </Button>
      </div>
    )
  }

  return null
}
