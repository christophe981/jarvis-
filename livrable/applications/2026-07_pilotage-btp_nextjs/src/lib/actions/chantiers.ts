"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getActiveOrg } from "@/lib/supabase/org"
import {
  chantierSchema,
  chantierUpdateSchema,
  type ChantierInput,
  type ChantierUpdateInput,
} from "@/lib/validations/chantiers"

function toRow(input: ChantierInput) {
  return {
    name: input.name,
    client_id: input.clientId || null,
    address: input.address || null,
    status: input.status,
    start_date: input.startDate || null,
    end_date_estimated: input.endDateEstimated || null,
    budget_estimated: input.budgetEstimated ?? null,
    description: input.description || null,
  }
}

export async function createChantier(input: ChantierInput) {
  const parsed = chantierSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { data, error } = await supabase
    .from("chantiers")
    .insert({ org_id: orgId, ...toRow(parsed.data) })
    .select("id")
    .single()

  if (error || !data) return { error: "Impossible de créer le chantier" }

  revalidatePath("/chantiers")
  redirect(`/chantiers/${data.id}`)
}

export async function updateChantier(chantierId: string, input: ChantierInput) {
  const parsed = chantierSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { error } = await supabase
    .from("chantiers")
    .update(toRow(parsed.data))
    .eq("id", chantierId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de mettre à jour le chantier" }

  revalidatePath(`/chantiers/${chantierId}`)
  revalidatePath("/chantiers")
  return { success: true }
}

export async function createChantierUpdate(input: ChantierUpdateInput) {
  const parsed = chantierUpdateSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId, userId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  // org_id derive du chantier reel en base : jamais confiance a une valeur du client.
  const { data: chantier } = await supabase
    .from("chantiers")
    .select("id, org_id")
    .eq("id", parsed.data.chantierId)
    .single()

  if (!chantier) return { error: "Chantier introuvable" }

  const { error } = await supabase.from("chantier_updates").insert({
    org_id: chantier.org_id,
    chantier_id: parsed.data.chantierId,
    author_id: userId,
    progress_percent: parsed.data.progressPercent ?? null,
    note: parsed.data.note || null,
    photo_urls: parsed.data.photoPaths,
  })

  if (error) return { error: "Impossible d'enregistrer la mise à jour" }

  revalidatePath(`/chantiers/${parsed.data.chantierId}`)
  revalidatePath("/dashboard")
  return { success: true }
}
