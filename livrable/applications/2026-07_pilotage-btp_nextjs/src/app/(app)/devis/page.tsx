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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0f2742]">Devis</h1>
          <p className="text-sm text-muted-foreground">Vos devis émis à vos clients.</p>
        </div>
        <Button render={<Link href="/devis/nouveau" />} nativeButton={false}>Nouveau devis</Button>
      </div>

      {devisList && devisList.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Montant TTC</TableHead>
              <TableHead>Émis le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devisList.map((devis) => (
              <TableRow key={devis.id}>
                <TableCell className="font-medium">
                  <Link href={`/devis/${devis.id}`}>{devis.number}</Link>
                </TableCell>
                <TableCell>{(devis.clients as { name?: string } | null)?.name || "—"}</TableCell>
                <TableCell>
                  <DevisStatusBadge status={devis.status as DevisStatusValue} />
                </TableCell>
                <TableCell>{Number(devis.amount_ttc).toFixed(2)} €</TableCell>
                <TableCell>{devis.issued_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#e3e9f0] py-16 text-center">
          <p className="text-sm text-muted-foreground">Aucun devis pour l&apos;instant.</p>
          <Button render={<Link href="/devis/nouveau" />} nativeButton={false}>Nouveau devis</Button>
        </div>
      )}
    </div>
  )
}
