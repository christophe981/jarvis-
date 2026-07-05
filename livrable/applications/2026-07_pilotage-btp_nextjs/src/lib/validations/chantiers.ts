import { z } from "zod"

export const chantierStatusValues = [
  "a_venir",
  "en_cours",
  "termine",
  "archive",
] as const

export type ChantierStatus = (typeof chantierStatusValues)[number]

export const chantierStatusLabels: Record<ChantierStatus, string> = {
  a_venir: "À venir",
  en_cours: "En cours",
  termine: "Terminé",
  archive: "Archivé",
}

// react-hook-form + valueAsNumber (ou setValueAs) renvoie NaN sur un champ vide.
// Le nettoyage NaN -> undefined se fait cote formulaire (setValueAs), pas ici :
// z.preprocess casse l'inference de type entre useForm<T> et zodResolver (le type
// "input" d'un preprocess est `unknown`, incompatible avec le generic de useForm).
export const chantierSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  clientId: z.string().uuid().optional().or(z.literal("")),
  address: z.string().optional(),
  status: z.enum(chantierStatusValues),
  startDate: z.string().optional().or(z.literal("")),
  endDateEstimated: z.string().optional().or(z.literal("")),
  budgetEstimated: z.number().nonnegative("Doit être positif").optional(),
  description: z.string().optional(),
})

export type ChantierInput = z.infer<typeof chantierSchema>

export const chantierUpdateFormSchema = z.object({
  progressPercent: z.number().int().min(0).max(100).optional(),
  note: z.string().optional(),
})

export type ChantierUpdateFormInput = z.infer<typeof chantierUpdateFormSchema>

export const chantierUpdateSchema = chantierUpdateFormSchema
  .extend({
    chantierId: z.string().uuid(),
    photoPaths: z.array(z.string()).max(6, "6 photos maximum par mise à jour").default([]),
  })
  .refine(
    (data) =>
      !!data.note?.trim() ||
      data.progressPercent !== undefined ||
      data.photoPaths.length > 0,
    { message: "Ajoute une note, un pourcentage ou une photo", path: ["note"] }
  )

export type ChantierUpdateInput = z.infer<typeof chantierUpdateSchema>
