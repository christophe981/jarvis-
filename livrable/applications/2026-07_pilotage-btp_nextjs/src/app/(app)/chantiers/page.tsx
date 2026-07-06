import { MapPinIcon, SearchIcon } from "lucide-react"
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
import { getLatestProgressByChantier } from "@/lib/queries/chantiers"
import {
  chantierStatusLabels,
  chantierStatusValues,
  type ChantierStatus,
} from "@/lib/validations/chantiers"
import { cn } from "@/lib/utils"

function formatBudget(value: number | null) {
  if (value === null) return "—"
  return `${value.toLocaleString("fr-FR")} €`
}

export default async function ChantiersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const { status, q } = await searchParams
  const activeStatus = chantierStatusValues.includes(status as ChantierStatus)
    ? (status as ChantierStatus)
    : undefined

  const { supabase, orgId } = await getActiveOrg()

  let query = supabase
    .from("chantiers")
    .select("id, name, address, status, end_date_estimated, budget_estimated, clients(name)")
    .order("created_at", { ascending: false })

  if (orgId) query = query.eq("org_id", orgId)
  if (activeStatus) query = query.eq("status", activeStatus)
  if (q) query = query.ilike("name", `%${q}%`)

  const [{ data: chantiers }, { data: clients }, { data: allChantiers }, progressByChantier] =
    orgId
      ? await Promise.all([
          query,
          supabase.from("clients").select("id, name").eq("org_id", orgId),
          supabase.from("chantiers").select("status").eq("org_id", orgId),
          getLatestProgressByChantier(supabase, orgId),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }, {} as Record<string, number>]

  const counts = chantierStatusValues.reduce(
    (acc, s) => ({ ...acc, [s]: (allChantiers ?? []).filter((c) => c.status === s).length }),
    {} as Record<ChantierStatus, number>
  )
  const total = (allChantiers ?? []).length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">Chantiers</h1>
          <p className="mt-1 text-[13.5px] text-brand-muted">
            {total} chantier{total !== 1 ? "s" : ""}
            {chantierStatusValues.map((s) =>
              counts[s] > 0 ? ` · ${counts[s]} ${chantierStatusLabels[s].toLowerCase()}` : ""
            )}
          </p>
        </div>
        <NewChantierDialog clients={clients ?? []} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-[11px] border border-brand-line bg-white p-1">
          <Link
            href="/chantiers"
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap",
              !activeStatus ? "bg-brand-navy text-white" : "text-brand-muted"
            )}
          >
            Tous <span className="opacity-60">{total}</span>
          </Link>
          {chantierStatusValues.map((s) => (
            <Link
              key={s}
              href={`/chantiers?status=${s}`}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap",
                activeStatus === s ? "bg-brand-navy text-white" : "text-brand-muted"
              )}
            >
              {chantierStatusLabels[s]} <span className="opacity-60">{counts[s]}</span>
            </Link>
          ))}
        </div>

        <form className="flex items-center gap-2 rounded-[11px] border border-brand-line bg-white px-3 py-2 text-brand-muted-2">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <SearchIcon className="size-4" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Rechercher un chantier…"
            className="w-[220px] text-[12.5px] text-brand-ink outline-none placeholder:text-brand-muted-2"
          />
        </form>
      </div>

      {chantiers && chantiers.length > 0 ? (
        <div className="overflow-hidden rounded-[14px] border border-brand-line bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8fafd]">
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Chantier
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Client
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Statut
                </TableHead>
                <TableHead className="w-[130px] text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Avancement
                </TableHead>
                <TableHead className="text-right text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Budget
                </TableHead>
                <TableHead className="text-right text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Fin est.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chantiers.map((chantier) => {
                const pct = progressByChantier[chantier.id] ?? null
                return (
                  <TableRow key={chantier.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/chantiers/${chantier.id}`} className="block">
                        <div className="text-[13px] font-semibold text-brand-ink">
                          {chantier.name}
                        </div>
                        {chantier.address && (
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-brand-muted-2">
                            <MapPinIcon className="size-2.5" />
                            {chantier.address}
                          </div>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell className="text-[12.5px] text-brand-muted">
                      {(chantier.clients as { name?: string } | null)?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={chantier.status as ChantierStatus} />
                    </TableCell>
                    <TableCell>
                      {pct !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eef2f7]">
                            <div
                              className="h-full rounded-full bg-brand-accent"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11.5px] font-bold text-brand-navy">{pct}%</span>
                        </div>
                      ) : (
                        <span className="text-[11.5px] text-brand-muted-2">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-[12.5px] font-semibold text-brand-ink">
                      {formatBudget(chantier.budget_estimated)}
                    </TableCell>
                    <TableCell className="text-right text-[12.5px] text-brand-muted">
                      {chantier.end_date_estimated || "—"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-brand-line py-16 text-center">
          <p className="text-sm text-brand-muted">Aucun chantier pour l&apos;instant.</p>
          <NewChantierDialog clients={clients ?? []} />
        </div>
      )}
    </div>
  )
}
