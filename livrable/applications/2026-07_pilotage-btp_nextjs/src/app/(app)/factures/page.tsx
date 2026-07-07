import Link from "next/link"

import { FactureStatusBadge } from "@/components/factures/facture-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getActiveOrg } from "@/lib/supabase/org"
import type { FactureStatusValue } from "@/lib/validations/factures"

export default async function FacturesPage() {
  const { supabase, orgId } = await getActiveOrg()

  const { data: facturesList } = orgId
    ? await supabase
        .from("factures")
        .select("id, number, status, amount_ttc, due_date, clients(name)")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
    : { data: [] }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">Factures</h1>
        <p className="mt-1 text-[13.5px] text-brand-muted">
          {facturesList?.length ?? 0} factures émises à vos clients.
        </p>
      </div>

      {facturesList && facturesList.length > 0 ? (
        <div className="overflow-hidden rounded-[14px] border border-brand-line bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8fafd]">
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Numéro
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Client
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Statut
                </TableHead>
                <TableHead className="text-right text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Montant TTC
                </TableHead>
                <TableHead className="text-right text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Échéance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturesList.map((facture) => (
                <TableRow key={facture.id}>
                  <TableCell>
                    <Link
                      href={`/factures/${facture.id}`}
                      className="text-[13px] font-semibold text-brand-ink"
                    >
                      {facture.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[12.5px] text-brand-muted">
                    {(facture.clients as { name?: string } | null)?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <FactureStatusBadge status={facture.status as FactureStatusValue} />
                  </TableCell>
                  <TableCell className="text-right text-[12.5px] font-semibold text-brand-ink">
                    {Number(facture.amount_ttc).toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-right text-[12.5px] text-brand-muted">
                    {facture.due_date ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-brand-line py-16 text-center">
          <p className="text-[13px] text-brand-muted">Aucune facture pour l&apos;instant.</p>
          <p className="text-xs text-brand-muted-2">
            Convertis un devis accepté en facture depuis sa page de détail.
          </p>
        </div>
      )}
    </div>
  )
}
