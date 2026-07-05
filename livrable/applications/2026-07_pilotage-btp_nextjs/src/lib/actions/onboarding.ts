"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { onboardingSchema } from "@/lib/validations/auth"

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createOrganization(input: { orgName: string }) {
  const parsed = onboardingSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const supabase = await createClient()
  const baseSlug = slugify(parsed.data.orgName) || "organisation"
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

  const { error } = await supabase.rpc("create_organization", {
    org_name: parsed.data.orgName,
    org_slug: slug,
  })

  if (error) {
    return { error: "Impossible de créer l'organisation" }
  }

  redirect("/dashboard")
}
