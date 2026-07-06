import { notFound } from "next/navigation"

import { ChantierForm } from "@/components/chantiers/chantier-form"
import { ChantierHeaderCard } from "@/components/chantiers/chantier-header-card"
import { ChantierUpdateForm } from "@/components/chantiers/chantier-update-form"
import { ChantierUpdateTimeline } from "@/components/chantiers/chantier-update-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getActiveOrg } from "@/lib/supabase/org"
import { getSignedPhotoUrl } from "@/lib/storage"
import type { ChantierStatus } from "@/lib/validations/chantiers"
import type { DevisStatusValue } from "@/lib/validations/devis"

export default async function ChantierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, orgId } = await getActiveOrg()

  if (!orgId) notFound()

  const { data: chantier } = await supabase
    .from("chantiers")
    .select("*, clients(name)")
    .eq("id", id)
    .eq("org_id", orgId)
    .single()

  if (!chantier) notFound()

  const [{ data: clients }, { data: updatesRaw }, { data: linkedDevis }] = await Promise.all([
    supabase.from("clients").select("id, name").eq("org_id", orgId),
    supabase
      .from("chantier_updates")
      .select("id, created_at, progress_percent, note, photo_urls")
      .eq("chantier_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("devis")
      .select("id, number, status, amount_ttc")
      .eq("chantier_id", id)
      .order("created_at", { ascending: false }),
  ])

  const latestProgress =
    (updatesRaw ?? []).find((u) => u.progress_percent !== null)?.progress_percent ?? null

  const updates = await Promise.all(
    (updatesRaw ?? []).map(async (update) => ({
      id: update.id,
      createdAt: update.created_at,
      progressPercent: update.progress_percent,
      note: update.note,
      photoUrls: (
        await Promise.all(
          (update.photo_urls ?? []).map((path: string) => getSignedPhotoUrl(supabase, path))
        )
      ).filter((url): url is string => !!url),
    }))
  )

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <ChantierHeaderCard
        name={chantier.name}
        address={chantier.address}
        status={chantier.status as ChantierStatus}
        clientName={(chantier.clients as { name?: string } | null)?.name ?? null}
        budget={chantier.budget_estimated}
        startDate={chantier.start_date}
        endDateEstimated={chantier.end_date_estimated}
        progressPercent={latestProgress}
        linkedDevis={(linkedDevis ?? []).map((d) => ({
          id: d.id,
          number: d.number,
          status: d.status as DevisStatusValue,
          amount_ttc: Number(d.amount_ttc),
        }))}
      />

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Infos</TabsTrigger>
          <TabsTrigger value="avancement">Avancement</TabsTrigger>
        </TabsList>
        <TabsContent value="infos" className="pt-4">
          <ChantierForm
            chantierId={chantier.id}
            clients={clients ?? []}
            defaultValues={{
              name: chantier.name,
              clientId: chantier.client_id ?? "",
              address: chantier.address ?? "",
              status: chantier.status as ChantierStatus,
              startDate: chantier.start_date ?? "",
              endDateEstimated: chantier.end_date_estimated ?? "",
              budgetEstimated: chantier.budget_estimated ?? undefined,
              description: chantier.description ?? "",
            }}
          />
        </TabsContent>
        <TabsContent value="avancement" className="flex flex-col gap-6 pt-4">
          <ChantierUpdateForm orgId={orgId} chantierId={chantier.id} />
          <ChantierUpdateTimeline updates={updates} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
