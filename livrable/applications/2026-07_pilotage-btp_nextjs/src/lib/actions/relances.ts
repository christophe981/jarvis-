"use server"

import { revalidatePath } from "next/cache"

import { runRelancesSweep } from "@/lib/relances/run-sweep"
import { getActiveOrg } from "@/lib/supabase/org"

export async function triggerRelancesNow() {
  const { orgId } = await getActiveOrg()
  if (!orgId) {
    return { devisCount: 0, facturesCount: 0, errors: 0, error: "Organisation introuvable" }
  }

  const result = await runRelancesSweep(orgId)
  revalidatePath("/relances")
  revalidatePath("/factures")
  revalidatePath("/dashboard")
  return result
}
