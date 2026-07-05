"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { loginSchema, signupSchema } from "@/lib/validations/auth"

export async function signIn(input: { email: string; password: string }) {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "Ton email n'est pas encore confirmé. Vérifie ta boîte mail (et les spams) et clique sur le lien reçu.",
      }
    }
    return { error: "Email ou mot de passe incorrect" }
  }

  redirect("/dashboard")
}

export async function signUp(input: {
  fullName: string
  email: string
  password: string
}) {
  const parsed = signupSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/onboarding")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
