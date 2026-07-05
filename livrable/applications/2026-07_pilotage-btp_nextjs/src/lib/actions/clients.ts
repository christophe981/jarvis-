"use server"

import { revalidatePath } from "next/cache"

import { getActiveOrg } from "@/lib/supabase/org"
import { clientSchema, type ClientInput } from "@/lib/validations/clients"

function toRow(input: ClientInput) {
  return {
    name: input.name,
    company_name: input.companyName || null,
    email: input.email || null,
    phone: input.phone || null,
    address: input.address || null,
    siret: input.siret || null,
    notes: input.notes || null,
  }
}

export async function createClientRecord(input: ClientInput) {
  const parsed = clientSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { error } = await supabase
    .from("clients")
    .insert({ org_id: orgId, ...toRow(parsed.data) })

  if (error) return { error: "Impossible de créer le client" }

  revalidatePath("/clients")
  return { success: true }
}

export async function updateClientRecord(clientId: string, input: ClientInput) {
  const parsed = clientSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { error } = await supabase
    .from("clients")
    .update(toRow(parsed.data))
    .eq("id", clientId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de mettre à jour le client" }

  revalidatePath("/clients")
  return { success: true }
}

export async function deleteClientRecord(clientId: string) {
  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de supprimer le client" }

  revalidatePath("/clients")
  return { success: true }
}
