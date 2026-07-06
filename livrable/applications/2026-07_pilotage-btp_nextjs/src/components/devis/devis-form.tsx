"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createDevis, updateDevis } from "@/lib/actions/devis"
import { computeDevisTotals, devisSchema, type DevisInput } from "@/lib/validations/devis"

const numberField = {
  setValueAs: (v: unknown) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)),
}

export function DevisForm({
  devisId,
  defaultValues,
  clients,
  chantiers,
  onSuccess,
}: {
  devisId?: string
  defaultValues?: Partial<DevisInput>
  clients: { id: string; name: string }[]
  chantiers: { id: string; name: string }[]
  onSuccess?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DevisInput>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      tvaRate: 20,
      issuedDate: new Date().toISOString().slice(0, 10),
      lines: [{ description: "", quantity: 1, unit: "", unitPrice: 0 }],
      ...defaultValues,
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: "lines" })
  const watchedLines = useWatch({ control, name: "lines" })
  const watchedTva = useWatch({ control, name: "tvaRate" })

  const totals = computeDevisTotals(
    (watchedLines ?? []).map((l) => ({
      description: l?.description ?? "",
      quantity: Number(l?.quantity) || 0,
      unit: l?.unit,
      unitPrice: Number(l?.unitPrice) || 0,
    })),
    Number(watchedTva) || 0
  )

  const onSubmit = (values: DevisInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = devisId ? await updateDevis(devisId, values) : await createDevis(values)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      onSuccess?.()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Client *</Label>
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.clientId && (
            <p className="text-sm text-destructive">{errors.clientId.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Chantier</Label>
          <Controller
            control={control}
            name="chantierId"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Aucun chantier" />
                </SelectTrigger>
                <SelectContent>
                  {chantiers.map((chantier) => (
                    <SelectItem key={chantier.id} value={chantier.id}>
                      {chantier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="issuedDate">Date d&apos;émission</Label>
          <Input id="issuedDate" type="date" {...register("issuedDate")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="validUntil">Valable jusqu&apos;au</Label>
          <Input id="validUntil" type="date" {...register("validUntil")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tvaRate">TVA (%)</Label>
          <Input id="tvaRate" type="number" step="0.1" {...register("tvaRate", numberField)} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Lignes du devis *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: "", quantity: 1, unit: "", unitPrice: 0 })}
          >
            <PlusIcon /> Ajouter une ligne
          </Button>
        </div>
        {errors.lines?.message && (
          <p className="text-sm text-destructive">{errors.lines.message}</p>
        )}

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_80px_90px_110px_auto] gap-2 rounded-lg border border-brand-line p-2.5">
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Description"
                  {...register(`lines.${index}.description`)}
                />
                {errors.lines?.[index]?.description && (
                  <p className="text-xs text-destructive">
                    {errors.lines[index]?.description?.message}
                  </p>
                )}
              </div>
              <Input
                type="number"
                step="0.01"
                placeholder="Qté"
                {...register(`lines.${index}.quantity`, numberField)}
              />
              <Input placeholder="Unité" {...register(`lines.${index}.unit`)} />
              <Input
                type="number"
                step="0.01"
                placeholder="Prix unitaire"
                {...register(`lines.${index}.unitPrice`, numberField)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={fields.length <= 1}
                onClick={() => remove(index)}
              >
                <TrashIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 rounded-lg bg-muted/50 p-3 text-sm">
        <div className="flex gap-6">
          <span className="text-muted-foreground">Total HT</span>
          <span className="font-medium">{totals.amountHt.toFixed(2)} €</span>
        </div>
        <div className="flex gap-6">
          <span className="text-muted-foreground">Total TTC</span>
          <span className="font-semibold text-brand-navy">{totals.amountTtc.toFixed(2)} €</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes / conditions</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : devisId ? "Enregistrer" : "Créer le devis"}
        </Button>
      </div>
    </form>
  )
}
