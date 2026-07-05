import { z } from "zod"

export const clientSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  companyName: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  siret: z.string().optional(),
  notes: z.string().optional(),
})

export type ClientInput = z.infer<typeof clientSchema>
