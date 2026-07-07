"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { recordPaiement } from "@/lib/actions/factures"
import {
  paiementMethodLabels,
  paiementMethodValues,
  paiementSchema,
  type PaiementInput,
} from "@/lib/validations/factures"

export function RecordPaiementDialog({ factureId }: { factureId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaiementInput>({
    resolver: zodResolver(paiementSchema),
    defaultValues: {
      method: "virement",
      paidAt: new Date().toISOString().slice(0, 10),
    },
  })

  const onSubmit = (values: PaiementInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = await recordPaiement(factureId, values)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Enregistrer un paiement</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", {
                setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)),
              })}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Méthode</Label>
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paiementMethodValues.map((method) => (
                      <SelectItem key={method} value={method}>
                        {paiementMethodLabels[method]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="paidAt">Date du paiement</Label>
            <Input id="paidAt" type="date" {...register("paidAt")} />
            {errors.paidAt && <p className="text-sm text-destructive">{errors.paidAt.message}</p>}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
