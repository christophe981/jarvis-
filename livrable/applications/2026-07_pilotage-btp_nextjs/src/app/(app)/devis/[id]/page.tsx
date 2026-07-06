import Link from "next/link"
import { notFound } from "next/navigation"

import { DevisForm } from "@/components/devis/devis-form"
import { DevisStatusActions } from "@/components/devis/devis-status-actions"
import { DevisStatusBadge } from "@/components/devis/devis-status-badge"
import { Button } from "@/components/ui/button"
import { getActiveOrg } from "@/lib/supabase/org"
import type { DevisStatusValue } from "@/lib/validations/devis"

export default async function DevisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, orgId } = await getActiveOrg()

  if (!orgId) notFound()

  const { data: devis } = await supabase
    .from("devis")
    .select("*, clients(id, name)")
    .eq("id", id)
    .eq("org_id", orgId)
    .single()

  if (!devis) notFound()

  const { data: lines } = await supabase
    .from("devis_lines")
    .select("*")
    .eq("devis_id", id)
    .order("position", { ascending: true })

  const [{ data: clients }, { data: chantiers }] = await Promise.all([
    supabase.from("clients").select("id, name").eq("org_id", orgId),
    supabase.from("chantiers").select("id, name").eq("org_id", orgId),
  ])

  const status = devis.status as DevisStatusValue
  const client = devis.clients as { id: string; name: string } | null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-brand-navy">{devis.number}</h1>
          <DevisStatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            render={<Link href={`/api/devis/${devis.id}/pdf`} />}
            nativeButton={false}
          >
            Télécharger le PDF
          </Button>
          <DevisStatusActions devisId={devis.id} status={status} />
        </div>
      </div>

      {status === "brouillon" ? (
        <div className="max-w-2xl">
          <DevisForm
            devisId={devis.id}
            clients={clients ?? []}
            chantiers={chantiers ?? []}
            defaultValues={{
              clientId: devis.client_id,
              chantierId: devis.chantier_id ?? "",
              tvaRate: devis.tva_rate,
              issuedDate: devis.issued_date,
              validUntil: devis.valid_until ?? "",
              notes: devis.notes ?? "",
              lines: (lines ?? []).map((line) => ({
                description: line.description,
                quantity: line.quantity,
                unit: line.unit ?? "",
                unitPrice: line.unit_price,
              })),
            }}
          />
        </div>
      ) : (
        <div className="max-w-2xl rounded-xl border border-brand-line p-6">
          <div className="mb-4 flex justify-between text-sm text-muted-foreground">
            <span>Client : {client?.name ?? "—"}</span>
            <span>Émis le {devis.issued_date}</span>
          </div>
          <div className="flex flex-col gap-2">
            {(lines ?? []).map((line) => (
              <div key={line.id} className="flex justify-between border-b border-brand-line py-2 text-sm">
                <span>
                  {line.description}
                  {line.unit ? ` (${line.quantity} ${line.unit})` : ` x${line.quantity}`}
                </span>
                <span>{Number(line.total).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-end gap-1 text-sm">
            <span className="text-muted-foreground">Total HT : {Number(devis.amount_ht).toFixed(2)} €</span>
            <span className="font-semibold text-brand-navy">
              Total TTC : {Number(devis.amount_ttc).toFixed(2)} €
            </span>
          </div>
          {devis.notes && <p className="mt-4 text-sm text-muted-foreground">{devis.notes}</p>}
        </div>
      )}
    </div>
  )
}
