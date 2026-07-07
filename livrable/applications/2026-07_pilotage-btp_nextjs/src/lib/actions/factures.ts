"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getActiveOrg } from "@/lib/supabase/org"
import {
  computeFactureTotals,
  factureSchema,
  factureStatusValues,
  paiementSchema,
  type FactureInput,
  type PaiementInput,
} from "@/lib/validations/factures"
import type { FactureStatusValue } from "@/lib/validations/factures"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

async function generateFactureNumber(supabase: SupabaseClient<Database>, orgId: string) {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from("factures")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .gte("created_at", `${year}-01-01`)

  const seq = (count ?? 0) + 1
  return `FAC-${year}-${String(seq).padStart(3, "0")}`
}

async function replaceLines(
  supabase: SupabaseClient<Database>,
  factureId: string,
  lines: FactureInput["lines"]
) {
  await supabase.from("facture_lines").delete().eq("facture_id", factureId)

  const { error } = await supabase.from("facture_lines").insert(
    lines.map((line, index) => ({
      facture_id: factureId,
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

export async function createFactureFromDevis(devisId: string) {
  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { data: devis } = await supabase
    .from("devis")
    .select("*")
    .eq("id", devisId)
    .eq("org_id", orgId)
    .single()

  if (!devis) return { error: "Devis introuvable" }
  if (devis.status !== "accepte") return { error: "Seul un devis accepté peut être converti" }

  const { data: existing } = await supabase
    .from("factures")
    .select("id")
    .eq("devis_id", devisId)
    .maybeSingle()
  if (existing) return { error: "Ce devis a déjà été converti en facture" }

  const { data: lines } = await supabase
    .from("devis_lines")
    .select("*")
    .eq("devis_id", devisId)
    .order("position", { ascending: true })

  const number = await generateFactureNumber(supabase, orgId)
  const issuedDate = new Date()
  const dueDate = new Date(issuedDate)
  dueDate.setDate(dueDate.getDate() + 30)

  const { data: facture, error } = await supabase
    .from("factures")
    .insert({
      org_id: orgId,
      client_id: devis.client_id,
      chantier_id: devis.chantier_id,
      devis_id: devis.id,
      number,
      tva_rate: devis.tva_rate,
      amount_ht: devis.amount_ht,
      amount_ttc: devis.amount_ttc,
      issued_date: issuedDate.toISOString().slice(0, 10),
      due_date: dueDate.toISOString().slice(0, 10),
      notes: devis.notes,
    })
    .select("id")
    .single()

  if (error || !facture) return { error: "Impossible de créer la facture" }

  const linesError = await replaceLines(
    supabase,
    facture.id,
    (lines ?? []).map((line) => ({
      description: line.description,
      quantity: line.quantity,
      unit: line.unit ?? "",
      unitPrice: line.unit_price,
    }))
  )
  if (linesError) {
    await supabase.from("factures").delete().eq("id", facture.id)
    return { error: "Impossible d'enregistrer les lignes de la facture" }
  }

  revalidatePath(`/devis/${devisId}`)
  revalidatePath("/factures")
  revalidatePath("/dashboard")
  redirect(`/factures/${facture.id}`)
}

export async function updateFacture(factureId: string, input: FactureInput) {
  const parsed = factureSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { amountHt, amountTtc } = computeFactureTotals(parsed.data.lines, parsed.data.tvaRate)

  const { error } = await supabase
    .from("factures")
    .update({
      client_id: parsed.data.clientId,
      chantier_id: parsed.data.chantierId || null,
      tva_rate: parsed.data.tvaRate,
      amount_ht: amountHt,
      amount_ttc: amountTtc,
      issued_date: parsed.data.issuedDate,
      due_date: parsed.data.dueDate || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", factureId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de mettre à jour la facture" }

  const linesError = await replaceLines(supabase, factureId, parsed.data.lines)
  if (linesError) return { error: "Impossible de mettre à jour les lignes de la facture" }

  revalidatePath(`/factures/${factureId}`)
  revalidatePath("/factures")
  return { success: true }
}

export async function updateFactureStatus(factureId: string, status: FactureStatusValue) {
  if (!factureStatusValues.includes(status)) {
    return { error: "Statut invalide" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const patch: { status: FactureStatusValue; sent_at?: string } = { status }
  if (status === "envoyee") patch.sent_at = new Date().toISOString()

  const { error } = await supabase
    .from("factures")
    .update(patch)
    .eq("id", factureId)
    .eq("org_id", orgId)

  if (error) return { error: "Impossible de changer le statut" }

  revalidatePath(`/factures/${factureId}`)
  revalidatePath("/factures")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function recordPaiement(factureId: string, input: PaiementInput) {
  const parsed = paiementSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" }
  }

  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { data: facture } = await supabase
    .from("factures")
    .select("id, amount_ttc")
    .eq("id", factureId)
    .eq("org_id", orgId)
    .single()
  if (!facture) return { error: "Facture introuvable" }

  const { error: insertError } = await supabase.from("paiements").insert({
    org_id: orgId,
    facture_id: factureId,
    amount: parsed.data.amount,
    method: parsed.data.method,
    paid_at: parsed.data.paidAt,
  })
  if (insertError) return { error: "Impossible d'enregistrer le paiement" }

  const { data: paiements } = await supabase
    .from("paiements")
    .select("amount")
    .eq("facture_id", factureId)

  const total = (paiements ?? []).reduce((sum, p) => sum + Number(p.amount), 0)
  const newStatus = total >= Number(facture.amount_ttc) ? "payee" : "payee_partielle"

  await supabase
    .from("factures")
    .update({
      status: newStatus,
      paid_at: newStatus === "payee" ? new Date().toISOString() : null,
    })
    .eq("id", factureId)

  revalidatePath(`/factures/${factureId}`)
  revalidatePath("/factures")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteFacture(factureId: string) {
  const { supabase, orgId } = await getActiveOrg()
  if (!orgId) return { error: "Organisation introuvable" }

  const { error } = await supabase.from("factures").delete().eq("id", factureId).eq("org_id", orgId)
  if (error) return { error: "Impossible de supprimer la facture" }

  revalidatePath("/factures")
  redirect("/factures")
}
