"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getActiveOrg } from "@/lib/supabase/org"
import {
  computeDevisTotals,
  devisSchema,
  devisStatusValues,
  type DevisInput,
  type DevisStatusValue,
} from "@/lib/validations/devis"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

async function generateDevisNumber(supabase: SupabaseClient<Database>, orgId: string) {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from("devis")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .gte("created_at", `${year}-01-01`)

  const seq = (count ?? 0) + 1
  return `DEV-${year}-${String(seq).padStart(3, "0")}`
}

async function replaceLines(
  supabase: SupabaseClient<Database>,
  devisId: string,
  lines: DevisInput["lines"]
) {
  await supabase.from("devis_lines").delete().eq("devis_id", devisId)

  const { error } = await supabase.from("devis_lines").insert(
    lines.map((line, index) => ({
      devis_id: devisId,
      position: index,
      description: line.description,
      quantity: line.quantity,
      unit: line.unit || null,
      unit_price: line.unitPrice,
      total: Math.round(line.quantity * line.unitPrice * 100) / 100,
    }))
  )

  return error
}

export async function createDevis(input: DevisInput) {
  const parsed = devisSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const number = await generateDevisNumber(supabase, orgId)
  const { amountHt, amountTtc } = computeDevisTotals(parsed.data.lines, parsed.data.tvaRate)

  const { data: devis, error } = await supabase
    .from("devis")
    .insert({
      org_id: orgId,
      client_id: parsed.data.clientId,
      chantier_id: parsed.data.chantierId || null,
      number,
      tva_rate: parsed.data.tvaRate,
      amount_ht: amountHt,
      amount_ttc: amountTtc,
      issued_date: parsed.data.issuedDate,
      valid_until: parsed.data.validUntil || null,
      notes: parsed.data.notes || null,
    })
    .select("id")
    .single()

  if (error || !devis) return { error: "Impossible de créer le devis" }

  const linesError = await replaceLines(supabase, devis.id, parsed.data.lines)
  if (linesError) {
    await supabase.from("devis").delete().eq("id", devis.id)
    return { error: "Impossible d'enregistrer les lignes du devis" }
  }

  revalidatePath("/devis")
  revalidatePath("/dashboard")
  redirect(`/devis/${devis.id}`)
}

export async function updateDevis(devisId: string, input: DevisInput) {
  const parsed = devisSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { amountHt, amountTtc } = computeDevisTotals(parsed.data.lines, parsed.data.tvaRate)

  const { error } = await supabase
    .from("devis")
    .update({
      client_id: parsed.data.clientId,
      chantier_id: parsed.data.chantierId || null,
      tva_rate: parsed.data.tvaRate,
      amount_ht: amountHt,
      amount_ttc: amountTtc,
      issued_date: parsed.data.issuedDate,
      valid_until: parsed.data.validUntil || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", devisId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de mettre à jour le devis" }

  const linesError = await replaceLines(supabase, devisId, parsed.data.lines)
  if (linesError) return { error: "Impossible de mettre à jour les lignes du devis" }

  revalidatePath(`/devis/${devisId}`)
  revalidatePath("/devis")
  return { success: true }
}

export async function updateDevisStatus(devisId: string, status: DevisStatusValue) {
  if (!devisStatusValues.includes(status)) {
    return { error: "Statut invalide" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const patch: { status: DevisStatusValue; sent_at?: string; responded_at?: string } = { status }
  if (status === "envoye") patch.sent_at = new Date().toISOString()
  if (status === "accepte" || status === "refuse") patch.responded_at = new Date().toISOString()

  const { error } = await supabase
    .from("devis")
    .update(patch)
    .eq("id", devisId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de changer le statut" }

  revalidatePath(`/devis/${devisId}`)
  revalidatePath("/devis")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteDevis(devisId: string) {
  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { error } = await supabase.from("devis").delete().eq("id", devisId).eq("org_id", orgId)
  if (error) return { error: "Impossible de supprimer le devis" }

  revalidatePath("/devis")
  redirect("/devis")
}
