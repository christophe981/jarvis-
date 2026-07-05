import Link from "next/link"

import { NewChantierDialog } from "@/components/chantiers/new-chantier-dialog"
import { StatusBadge } from "@/components/chantiers/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getActiveOrg } from "@/lib/supabase/org"
import {
  chantierStatusLabels,
  chantierStatusValues,
  type ChantierStatus,
} from "@/lib/validations/chantiers"
import { cn } from "@/lib/utils"

export default async function ChantiersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const activeStatus = chantierStatusValues.includes(status as ChantierStatus)
    ? (status as ChantierStatus)
    : undefined

  const { supabase, orgId } = await getActiveOrg()

  let query = supabase
    .from("chantiers")
    .select("id, name, address, status, end_date_estimated, clients(name)")
    .order("created_at", { ascending: false })

  if (orgId) query = query.eq("org_id", orgId)
  if (activeStatus) query = query.eq("status", activeStatus)

  const { data: chantiers } = orgId ? await query : { data: [] }
  const { data: clients } = orgId
    ? await supabase.from("clients").select("id, name").eq("org_id", orgId)
    : { data: [] }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0f2742]">Chantiers</h1>
          <p className="text-sm text-muted-foreground">Vos chantiers en cours et à venir.</p>
        </div>
        <NewChantierDialog clients={clients ?? []} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/chantiers"
          className={cn(
            "rounded-full border px-3 py-1 text-sm",
            !activeStatus ? "border-[#0f2742] bg-[#0f2742] text-white" : "border-[#e3e9f0]"
          )}
        >
          Tous
        </Link>
        {chantierStatusValues.map((s) => (
          <Link
            key={s}
            href={`/chantiers?status=${s}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              activeStatus === s ? "border-[#0f2742] bg-[#0f2742] text-white" : "border-[#e3e9f0]"
            )}
          >
            {chantierStatusLabels[s]}
          </Link>
        ))}
      </div>

      {chantiers && chantiers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Fin estimée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chantiers.map((chantier) => (
              <TableRow key={chantier.id} className="cursor-pointer">
                <TableCell className="font-medium">
                  <Link href={`/chantiers/${chantier.id}`}>{chantier.name}</Link>
                </TableCell>
                <TableCell>
                  {(chantier.clients as { name?: string } | null)?.name || "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={chantier.status as ChantierStatus} />
                </TableCell>
                <TableCell>{chantier.end_date_estimated || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#e3e9f0] py-16 text-center">
          <p className="text-sm text-muted-foreground">Aucun chantier pour l&apos;instant.</p>
          <NewChantierDialog clients={clients ?? []} />
        </div>
      )}
    </div>
  )
}
