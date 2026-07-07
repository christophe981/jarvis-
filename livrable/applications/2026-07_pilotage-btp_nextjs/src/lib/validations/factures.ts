import { z } from "zod"

export const factureStatusValues = [
  "brouillon",
  "envoyee",
  "payee_partielle",
  "payee",
  "en_retard",
  "annulee",
] as const

export type FactureStatusValue = (typeof factureStatusValues)[number]

export const factureStatusLabels: Record<FactureStatusValue, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  payee_partielle: "Payée partiellement",
  payee: "Payée",
  en_retard: "En retard",
  annulee: "Annulée",
}

export const factureLineSchema = z.object({
  description: z.string().min(1, "Description requise"),
  quantity: z.number().positive("Doit être positif"),
  unit: z.string().optional(),
  unitPrice: z.number().nonnegative("Doit être positif ou nul"),
})

export type FactureLineInput = z.infer<typeof factureLineSchema>

export const factureSchema = z.object({
  clientId: z.string().uuid("Sélectionne un client"),
  chantierId: z.string().uuid().optional().or(z.literal("")),
  tvaRate: z.number().nonnegative("Doit être positif ou nul"),
  issuedDate: z.string().min(1, "Date requise"),
  dueDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
  lines: z.array(factureLineSchema).min(1, "Ajoute au moins une ligne"),
})

export type FactureInput = z.infer<typeof factureSchema>

export function computeFactureTotals(lines: FactureLineInput[], tvaRate: number) {
  const amountHt = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  const amountTtc = amountHt * (1 + tvaRate / 100)
  return { amountHt: round2(amountHt), amountTtc: round2(amountTtc) }
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}

export const paiementMethodValues = ["virement", "cheque", "especes", "cb", "autre"] as const

export type PaiementMethodValue = (typeof paiementMethodValues)[number]

export const paiementMethodLabels: Record<PaiementMethodValue, string> = {
  virement: "Virement",
  cheque: "Chèque",
  especes: "Espèces",
  cb: "Carte bancaire",
  autre: "Autre",
}

export const paiementSchema = z.object({
  amount: z.number().positive("Doit être positif"),
  method: z.enum(paiementMethodValues),
  paidAt: z.string().min(1, "Date requise"),
})

export type PaiementInput = z.infer<typeof paiementSchema>
