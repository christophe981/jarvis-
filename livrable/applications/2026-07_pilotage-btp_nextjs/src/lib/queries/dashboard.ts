import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database.types"

type Client = SupabaseClient<Database>

export async function getChantiersEnCoursCount(supabase: Client, orgId: string) {
  const { count } = await supabase
    .from("chantiers")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .eq("status", "en_cours")

  return count ?? 0
}

export async function getChantiersEnCours(supabase: Client, orgId: string) {
  const { data } = await supabase
    .from("chantiers")
    .select("id, name, clients(name)")
    .eq("org_id", orgId)
    .eq("status", "en_cours")
    .order("created_at", { ascending: false })
    .limit(5)

  return (data ?? []).map((chantier) => ({
    id: chantier.id as string,
    name: chantier.name as string,
    clientName: (chantier.clients as { name?: string } | null)?.name ?? null,
  }))
}

type ActivityItem = {
  id: string
  type: "client" | "chantier" | "update"
  label: string
  href: string
  createdAt: string
}

export async function getRecentActivity(supabase: Client, orgId: string): Promise<ActivityItem[]> {
  const [clientsRes, chantiersRes, updatesRes] = await Promise.all([
    supabase
      .from("clients")
      .select("id, name, created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("chantiers")
      .select("id, name, created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("chantier_updates")
      .select("id, chantier_id, progress_percent, created_at, chantiers(name)")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const items: ActivityItem[] = [
    ...(clientsRes.data ?? []).map((c) => ({
      id: `client-${c.id}`,
      type: "client" as const,
      label: `Nouveau client : ${c.name}`,
      href: "/clients",
      createdAt: c.created_at as string,
    })),
    ...(chantiersRes.data ?? []).map((c) => ({
      id: `chantier-${c.id}`,
      type: "chantier" as const,
      label: `Nouveau chantier : ${c.name}`,
      href: `/chantiers/${c.id}`,
      createdAt: c.created_at as string,
    })),
    ...(updatesRes.data ?? []).map((u) => {
      const chantierName = (u.chantiers as { name?: string } | null)?.name ?? "un chantier"
      const progress = u.progress_percent !== null ? ` (${u.progress_percent}%)` : ""
      return {
        id: `update-${u.id}`,
        type: "update" as const,
        label: `Avancement sur ${chantierName}${progress}`,
        href: `/chantiers/${u.chantier_id}`,
        createdAt: u.created_at as string,
      }
    }),
  ]

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
}
