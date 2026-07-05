import { z } from "zod"

export const devisStatusValues = [
  "brouillon",
  "envoye",
  "accepte",
  "refuse",
  "expire",
] as const

export type DevisStatusValue = (typeof devisStatusValues)[number]

export const devisStatusLabels: Record<DevisStatusValue, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
  expire: "Expiré",
}

export const devisLineSchema = z.object({
  description: z.string().min(1, "Description requise"),
  quantity: z.number().positive("Doit être positif"),
  unit: z.string().optional(),
  unitPrice: z.number().nonnegative("Doit être positif ou nul"),
})

export type DevisLineInput = z.infer<typeof devisLineSchema>

export const devisSchema = z.object({
  clientId: z.string().uuid("Sélectionne un client"),
  chantierId: z.string().uuid().optional().or(z.literal("")),
  tvaRate: z.number().nonnegative("Doit être positif ou nul"),
  issuedDate: z.string().min(1, "Date requise"),
  validUntil: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
  lines: z.array(devisLineSchema).min(1, "Ajoute au moins une ligne"),
})

export type DevisInput = z.infer<typeof devisSchema>

export function computeDevisTotals(lines: DevisLineInput[], tvaRate: number) {
  const amountHt = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  const amountTtc = amountHt * (1 + tvaRate / 100)
  return { amountHt: round2(amountHt), amountTtc: round2(amountTtc) }
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}
