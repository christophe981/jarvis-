import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database.types"

// Dernier pourcentage d'avancement connu par chantier, a partir du fil
// chantier_updates. Une seule requete (pas de N+1), reduite cote JS.
export async function getLatestProgressByChantier(
  supabase: SupabaseClient<Database>,
  orgId: string
): Promise<Record<string, number>> {
  const { data } = await supabase
    .from("chantier_updates")
    .select("chantier_id, progress_percent, created_at")
    .eq("org_id", orgId)
    .not("progress_percent", "is", null)
    .order("created_at", { ascending: false })

  const latest: Record<string, number> = {}
  for (const row of data ?? []) {
    if (!(row.chantier_id in latest) && row.progress_percent !== null) {
      latest[row.chantier_id] = row.progress_percent
    }
  }
  return latest
}
