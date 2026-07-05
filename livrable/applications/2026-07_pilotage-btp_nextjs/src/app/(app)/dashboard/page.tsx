import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getActiveOrg } from "@/lib/supabase/org"
import {
  getChantiersEnCours,
  getChantiersEnCoursCount,
  getRecentActivity,
} from "@/lib/queries/dashboard"

export default async function DashboardPage() {
  const { supabase, orgId } = await getActiveOrg()

  let orgName = "—"
  let chantiersEnCoursCount = 0
  let chantiersEnCours: Awaited<ReturnType<typeof getChantiersEnCours>> = []
  let activity: Awaited<ReturnType<typeof getRecentActivity>> = []

  if (orgId) {
    const { data: org } = await supabase.from("organizations").select("name").eq("id", orgId).single()
    orgName = org?.name ?? "—"
    ;[chantiersEnCoursCount, chantiersEnCours, activity] = await Promise.all([
      getChantiersEnCoursCount(supabase, orgId),
      getChantiersEnCours(supabase, orgId),
      getRecentActivity(supabase, orgId),
    ])
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[#0f2742]">Bienvenue, {orgName}</h1>
        <p className="text-sm text-muted-foreground">Voici l&apos;état de votre activité.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Chantiers en cours</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{chantiersEnCoursCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Devis en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground">Disponible en Phase 2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Factures en retard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground">Disponible en Phase 3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">CA du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground">Disponible en Phase 3</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e3e9f0] p-4">
          <h2 className="mb-3 text-sm font-medium text-[#0f2742]">Chantiers en cours</h2>
          {chantiersEnCours.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {chantiersEnCours.map((chantier) => (
                <li key={chantier.id}>
                  <Link
                    href={`/chantiers/${chantier.id}`}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
                  >
                    <span className="font-medium">{chantier.name}</span>
                    <span className="text-muted-foreground">{chantier.clientName ?? "—"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun chantier en cours.</p>
          )}
        </div>

        <div className="rounded-xl border border-[#e3e9f0] p-4">
          <h2 className="mb-3 text-sm font-medium text-[#0f2742]">Activité récente</h2>
          {activity.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {activity.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune activité pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  )
}
