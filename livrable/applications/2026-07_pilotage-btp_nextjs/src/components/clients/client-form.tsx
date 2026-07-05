"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientRecord, updateClientRecord } from "@/lib/actions/clients"
import { clientSchema, type ClientInput } from "@/lib/validations/clients"

export function ClientForm({
  clientId,
  defaultValues,
  onSuccess,
}: {
  clientId?: string
  defaultValues?: Partial<ClientInput>
  onSuccess: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  })

  const onSubmit = (values: ClientInput) => {
    setServerError(null)
    startTransition(async () => {
      const result = clientId
        ? await updateClientRecord(clientId, values)
        : await createClientRecord(values)
      if (result?.error) {
        setServerError(result.error)
        return
      }
      onSuccess()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyName">Entreprise</Label>
        <Input id="companyName" {...register("companyName")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" {...register("address")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="siret">SIRET</Label>
        <Input id="siret" {...register("siret")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : clientId ? "Enregistrer" : "Créer le client"}
        </Button>
      </DialogFooter>
    </form>
  )
}
