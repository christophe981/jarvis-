import Link from "next/link"

import { getActiveOrg } from "@/lib/supabase/org"
import {
  getCaDuMois,
  getChantiersEnCours,
  getChantiersEnCoursCount,
  getDevisEnAttente,
  getFacturesEnRetard,
  getRecentActivity,
} from "@/lib/queries/dashboard"
import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  caption,
  muted,
}: {
  label: string
  value: string
  caption?: string
  muted?: boolean
}) {
  return (
    <div className="rounded-[14px] border border-brand-line bg-white p-4.5">
      <div className="text-[12.5px] font-medium text-brand-muted">{label}</div>
      <div
        className={cn(
          "mt-1.5 text-2xl font-extrabold",
          muted ? "text-brand-muted-2" : "text-brand-navy"
        )}
      >
        {value}
      </div>
      {caption && <div className="mt-0.5 text-xs text-brand-muted-2">{caption}</div>}
    </div>
  )
}

export default async function DashboardPage() {
  const { supabase, orgId } = await getActiveOrg()

  let orgName = "—"
  let chantiersEnCoursCount = 0
  let devisEnAttente = { count: 0, total: 0 }
  let facturesEnRetard = { count: 0, total: 0 }
  let caDuMois = 0
  let chantiersEnCours: Awaited<ReturnType<typeof getChantiersEnCours>> = []
  let activity: Awaited<ReturnType<typeof getRecentActivity>> = []

  if (orgId) {
    const { data: org } = await supabase.from("organizations").select("name").eq("id", orgId).single()
    orgName = org?.name ?? "—"
    ;[chantiersEnCoursCount, devisEnAttente, facturesEnRetard, caDuMois, chantiersEnCours, activity] =
      await Promise.all([
        getChantiersEnCoursCount(supabase, orgId),
        getDevisEnAttente(supabase, orgId),
        getFacturesEnRetard(supabase, orgId),
        getCaDuMois(supabase, orgId),
        getChantiersEnCours(supabase, orgId),
        getRecentActivity(supabase, orgId),
      ])
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">
          Bienvenue, {orgName}
        </h1>
        <p className="mt-1 text-[13.5px] text-brand-muted">
          Voici l&apos;état de votre activité aujourd&apos;hui.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Chantiers en cours" value={String(chantiersEnCoursCount)} />
        <StatCard
          label="Devis en attente"
          value={String(devisEnAttente.count)}
          caption={`${devisEnAttente.total.toFixed(2)} €`}
        />
        <StatCard
          label="Factures en retard"
          value={String(facturesEnRetard.count)}
          caption={`${facturesEnRetard.total.toFixed(2)} €`}
          muted={facturesEnRetard.count === 0}
        />
        <StatCard label="CA du mois" value={`${caDuMois.toFixed(2)} €`} caption="Paiements encaissés" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] border border-brand-line bg-white p-4.5">
          <h2 className="mb-3 text-[13px] font-bold text-brand-navy">Chantiers en cours</h2>
          {chantiersEnCours.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {chantiersEnCours.map((chantier) => (
                <li key={chantier.id}>
                  <Link
                    href={`/chantiers/${chantier.id}`}
                    className="flex items-center justify-between rounded-[10px] px-2.5 py-2 text-[13px] hover:bg-brand-bg-soft"
                  >
                    <span className="font-semibold text-brand-ink">{chantier.name}</span>
                    <span className="text-brand-muted">{chantier.clientName ?? "—"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-brand-muted">Aucun chantier en cours.</p>
          )}
        </div>

        <div className="rounded-[14px] border border-brand-line bg-white p-4.5">
          <h2 className="mb-3 text-[13px] font-bold text-brand-navy">Activité récente</h2>
          {activity.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {activity.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-[10px] px-2.5 py-2 text-[13px] hover:bg-brand-bg-soft"
                  >
                    <span className="text-brand-ink">{item.label}</span>
                    <span className="text-xs text-brand-muted-2">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-brand-muted">Aucune activité pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  )
}
