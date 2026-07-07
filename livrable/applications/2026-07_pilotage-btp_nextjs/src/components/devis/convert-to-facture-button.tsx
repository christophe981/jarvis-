"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { createFactureFromDevis } from "@/lib/actions/factures"

export function ConvertToFactureButton({ devisId }: { devisId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const onClick = () => {
    setError(null)
    startTransition(async () => {
      const result = await createFactureFromDevis(devisId)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button disabled={isPending} onClick={onClick}>
        {isPending ? "Conversion..." : "Convertir en facture"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
