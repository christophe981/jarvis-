"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"

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
import { createChantier, updateChantier } from "@/lib/actions/chantiers"
import {
  chantierSchema,
  chantierStatusLabels,
  chantierStatusValues,
  type ChantierInput,
} from "@/lib/validations/chantiers"

export function ChantierForm({
  chantierId,
  defaultValues,
  clients,
  onSuccess,
}: {
  chantierId?: string
  defaultValues?: Partial<ChantierInput>
  clients: { id: string; name: string }[]
  onSuccess?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChantierInput>({
    resolver: zodResolver(chantierSchema),
    defaultValues: { status: "a_venir", ...defaultValues },
  })

  const onSubmit = (values: ChantierInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = chantierId
        ? await updateChantier(chantierId, values)
        : await createChantier(values)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      onSuccess?.()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom du chantier *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Client</Label>
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Aucun client" />
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
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Statut</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chantierStatusValues.map((status) => (
                    <SelectItem key={status} value={status}>
                      {chantierStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">Date de début</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endDateEstimated">Fin estimée</Label>
          <Input id="endDateEstimated" type="date" {...register("endDateEstimated")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="budgetEstimated">Budget estimé (€)</Label>
        <Input
          id="budgetEstimated"
          type="number"
          step="0.01"
          {...register("budgetEstimated", {
            setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)),
          })}
        />
        {errors.budgetEstimated && (
          <p className="text-sm text-destructive">{errors.budgetEstimated.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : chantierId ? "Enregistrer" : "Créer le chantier"}
        </Button>
      </div>
    </form>
  )
}
