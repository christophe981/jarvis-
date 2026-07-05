import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  fullName: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
})

export type SignupInput = z.infer<typeof signupSchema>

export const onboardingSchema = z.object({
  orgName: z.string().min(2, "Nom trop court"),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
