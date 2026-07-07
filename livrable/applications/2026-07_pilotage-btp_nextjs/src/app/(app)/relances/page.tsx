import Link from "next/link"

import { RelancesTestButton } from "@/components/relances/relances-test-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getActiveOrg } from "@/lib/supabase/org"
import { cn } from "@/lib/utils"
import type { RelanceStatus, RelanceTargetType } from "@/types/database.types"

const STATUS_LABELS: Record<RelanceStatus, string> = {
  planifiee: "Planifiée",
  envoyee: "Envoyée",
  echec: "Échec",
  annulee: "Annulée",
}

const STATUS_STYLES: Record<RelanceStatus, string> = {
  planifiee: "bg-brand-navy/[0.08] text-[#2f5c86]",
  envoyee: "bg-[#168c5a]/[0.13] text-[#157a4e]",
  echec: "bg-[#c14a2b]/[0.12] text-[#c14a2b]",
  annulee: "bg-brand-muted-2/[0.13] text-brand-muted",
}

const TYPE_LABELS: Record<RelanceTargetType, string> = {
  devis: "Devis",
  facture: "Facture",
}

export default async function RelancesPage() {
  const { supabase, orgId } = await getActiveOrg()

  const { data: relancesList } = orgId
    ? await supabase
        .from("relances")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
    : { data: [] }

  const devisIds = (relancesList ?? [])
    .filter((r) => r.target_type === "devis")
    .map((r) => r.target_id)
  const factureIds = (relancesList ?? [])
    .filter((r) => r.target_type === "facture")
    .map((r) => r.target_id)

  const [{ data: devisRows }, { data: factureRows }] = await Promise.all([
    devisIds.length > 0
      ? supabase.from("devis").select("id, number").in("id", devisIds)
      : Promise.resolve({ data: [] as { id: string; number: string }[] }),
    factureIds.length > 0
      ? supabase.from("factures").select("id, number").in("id", factureIds)
      : Promise.resolve({ data: [] as { id: string; number: string }[] }),
  ])

  const devisLabels = new Map((devisRows ?? []).map((d) => [d.id, d.number]))
  const factureLabels = new Map((factureRows ?? []).map((f) => [f.id, f.number]))

  function targetHref(type: RelanceTargetType, id: string) {
    return type === "devis" ? `/devis/${id}` : `/factures/${id}`
  }

  function targetLabel(type: RelanceTargetType, id: string) {
    const label = type === "devis" ? devisLabels.get(id) : factureLabels.get(id)
    return label ?? "—"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">Relances</h1>
          <p className="mt-1 text-[13.5px] text-brand-muted">
            Historique des relances automatiques envoyées à vos clients.
          </p>
        </div>
        <RelancesTestButton />
      </div>

      {relancesList && relancesList.length > 0 ? (
        <div className="overflow-hidden rounded-[14px] border border-brand-line bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8fafd]">
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Type
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Cible
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Destinataire
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Statut
                </TableHead>
                <TableHead className="text-right text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relancesList.map((relance) => {
                const type = relance.target_type as RelanceTargetType
                const status = relance.status as RelanceStatus
                return (
                  <TableRow key={relance.id}>
                    <TableCell className="text-[12.5px] text-brand-muted">{TYPE_LABELS[type]}</TableCell>
                    <TableCell>
                      <Link
                        href={targetHref(type, relance.target_id)}
                        className="text-[13px] font-semibold text-brand-ink"
                      >
                        {targetLabel(type, relance.target_id)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-[12.5px] text-brand-muted">
                      {relance.recipient_email}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                          STATUS_STYLES[status]
                        )}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-[12.5px] text-brand-muted">
                      {new Date(relance.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-brand-line py-16 text-center">
          <p className="text-[13px] text-brand-muted">Aucune relance envoyée pour l&apos;instant.</p>
          <p className="text-xs text-brand-muted-2">
            Les devis sans réponse et les factures en retard sont relancés automatiquement chaque jour.
          </p>
        </div>
      )}
    </div>
  )
}
