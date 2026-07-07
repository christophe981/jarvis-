import { notFound } from "next/navigation"

import { FactureForm } from "@/components/factures/facture-form"
import { FactureStatusActions } from "@/components/factures/facture-status-actions"
import { FactureStatusBadge } from "@/components/factures/facture-status-badge"
import { RecordPaiementDialog } from "@/components/factures/record-paiement-dialog"
import { paiementMethodLabels, type PaiementMethodValue } from "@/lib/validations/factures"
import { getActiveOrg } from "@/lib/supabase/org"
import type { FactureStatusValue } from "@/lib/validations/factures"

export default async function FactureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, orgId } = await getActiveOrg()

  if (!orgId) notFound()

  const { data: facture } = await supabase
    .from("factures")
    .select("*, clients(id, name)")
    .eq("id", id)
    .eq("org_id", orgId)
    .single()

  if (!facture) notFound()

  const [{ data: lines }, { data: paiements }, { data: clients }, { data: chantiers }] =
    await Promise.all([
      supabase
        .from("facture_lines")
        .select("*")
        .eq("facture_id", id)
        .order("position", { ascending: true }),
      supabase
        .from("paiements")
        .select("*")
        .eq("facture_id", id)
        .order("paid_at", { ascending: false }),
      supabase.from("clients").select("id, name").eq("org_id", orgId),
      supabase.from("chantiers").select("id, name").eq("org_id", orgId),
    ])

  const status = facture.status as FactureStatusValue
  const client = facture.clients as { id: string; name: string } | null
  const totalPaid = (paiements ?? []).reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-brand-navy">{facture.number}</h1>
          <FactureStatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          {status !== "brouillon" && status !== "payee" && (
            <RecordPaiementDialog factureId={facture.id} />
          )}
          <FactureStatusActions factureId={facture.id} status={status} />
        </div>
      </div>

      {status === "brouillon" ? (
        <div className="max-w-2xl">
          <FactureForm
            factureId={facture.id}
            clients={clients ?? []}
            chantiers={chantiers ?? []}
            defaultValues={{
              clientId: facture.client_id,
              chantierId: facture.chantier_id ?? "",
              tvaRate: facture.tva_rate,
              issuedDate: facture.issued_date,
              dueDate: facture.due_date ?? "",
              notes: facture.notes ?? "",
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
            <span>Échéance : {facture.due_date ?? "—"}</span>
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
            <span className="text-muted-foreground">Total HT : {Number(facture.amount_ht).toFixed(2)} €</span>
            <span className="font-semibold text-brand-navy">
              Total TTC : {Number(facture.amount_ttc).toFixed(2)} €
            </span>
            {totalPaid > 0 && (
              <span className="text-muted-foreground">
                Payé : {totalPaid.toFixed(2)} € — reste {(Number(facture.amount_ttc) - totalPaid).toFixed(2)} €
              </span>
            )}
          </div>
          {facture.notes && <p className="mt-4 text-sm text-muted-foreground">{facture.notes}</p>}
        </div>
      )}

      {paiements && paiements.length > 0 && (
        <div className="max-w-2xl rounded-xl border border-brand-line p-6">
          <h2 className="mb-3 text-[13px] font-bold text-brand-navy">Paiements enregistrés</h2>
          <div className="flex flex-col gap-2">
            {paiements.map((paiement) => (
              <div key={paiement.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {new Date(paiement.paid_at).toLocaleDateString("fr-FR")} —{" "}
                  {paiementMethodLabels[paiement.method as PaiementMethodValue]}
                </span>
                <span className="font-medium text-brand-ink">{Number(paiement.amount).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
