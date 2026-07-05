"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createChantierUpdate } from "@/lib/actions/chantiers"
import { createClient } from "@/lib/supabase/client"
import { uploadChantierPhoto, validatePhotoFile } from "@/lib/storage"
import {
  chantierUpdateFormSchema,
  type ChantierUpdateFormInput,
} from "@/lib/validations/chantiers"

export function ChantierUpdateForm({
  orgId,
  chantierId,
}: {
  orgId: string
  chantierId: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  // Un input file est non-controllable par React : on force son remontage
  // (et donc la remise à zéro de son affichage) en changeant sa `key`.
  const [inputKey, setInputKey] = useState(0)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChantierUpdateFormInput>({ resolver: zodResolver(chantierUpdateFormSchema) })

  const onSubmit = (values: ChantierUpdateFormInput) => {
    setError(null)

    for (const file of files) {
      const validationError = validatePhotoFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        const photoPaths = await Promise.all(
          files.map((file) => uploadChantierPhoto(supabase, { orgId, chantierId, file }))
        )

        const result = await createChantierUpdate({
          chantierId,
          progressPercent: values.progressPercent,
          note: values.note,
          photoPaths,
        })

        if (result?.error) {
          setError(result.error)
          return
        }

        reset()
        setFiles([])
        setInputKey((key) => key + 1)
      } catch {
        setError("Échec de l'envoi des photos")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-xl border border-[#e3e9f0] p-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="progressPercent">Avancement (%)</Label>
          <Input
            id="progressPercent"
            type="number"
            min={0}
            max={100}
            {...register("progressPercent", {
              setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)),
            })}
          />
          {errors.progressPercent && (
            <p className="text-sm text-destructive">{errors.progressPercent.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="photos">Photos</Label>
          <input
            key={inputKey}
            id="photos"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-2.5 file:py-1.5 file:text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Note</Label>
        <Textarea id="note" rows={2} {...register("note")} />
      </div>
      {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi..." : "Ajouter la mise à jour"}
        </Button>
      </div>
    </form>
  )
}
