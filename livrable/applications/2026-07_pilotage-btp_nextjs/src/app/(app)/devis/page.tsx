import Link from "next/link"

import { DevisStatusBadge } from "@/components/devis/devis-status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getActiveOrg } from "@/lib/supabase/org"
import type { DevisStatusValue } from "@/lib/validations/devis"

export default async function DevisPage() {
  const { supabase, orgId } = await getActiveOrg()

  const { data: devisList } = orgId
    ? await supabase
        .from("devis")
        .select("id, number, status, amount_ttc, issued_date, clients(name)")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
    : { data: [] }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">Devis</h1>
          <p className="mt-1 text-[13.5px] text-brand-muted">
            {devisList?.length ?? 0} devis émis à vos clients.
          </p>
        </div>
        <Button render={<Link href="/devis/nouveau" />} nativeButton={false}>
          Nouveau devis
        </Button>
      </div>

      {devisList && devisList.length > 0 ? (
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
                  Émis le
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devisList.map((devis) => (
                <TableRow key={devis.id}>
                  <TableCell>
                    <Link
                      href={`/devis/${devis.id}`}
                      className="text-[13px] font-semibold text-brand-ink"
                    >
                      {devis.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[12.5px] text-brand-muted">
                    {(devis.clients as { name?: string } | null)?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <DevisStatusBadge status={devis.status as DevisStatusValue} />
                  </TableCell>
                  <TableCell className="text-right text-[12.5px] font-semibold text-brand-ink">
                    {Number(devis.amount_ttc).toFixed(2)} €
                  </TableCell>
                  <TableCell className="text-right text-[12.5px] text-brand-muted">
                    {devis.issued_date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-brand-line py-16 text-center">
          <p className="text-[13px] text-brand-muted">Aucun devis pour l&apos;instant.</p>
          <Button render={<Link href="/devis/nouveau" />} nativeButton={false}>
            Nouveau devis
          </Button>
        </div>
      )}
    </div>
  )
}
