import Link from "next/link"
import { FileTextIcon, MapPinIcon, ReceiptIcon } from "lucide-react"

import { DevisStatusBadge } from "@/components/devis/devis-status-badge"
import { FactureStatusBadge } from "@/components/factures/facture-status-badge"
import { chantierStatusLabels, type ChantierStatus } from "@/lib/validations/chantiers"
import type { DevisStatusValue } from "@/lib/validations/devis"
import type { FactureStatusValue } from "@/lib/validations/factures"

type LinkedDevis = {
  id: string
  number: string
  status: DevisStatusValue
  amount_ttc: number
}

type LinkedFacture = {
  id: string
  number: string
  status: FactureStatusValue
  amount_ttc: number
}

export function ChantierHeaderCard({
  name,
  address,
  status,
  clientName,
  budget,
  startDate,
  endDateEstimated,
  progressPercent,
  linkedDevis,
  linkedFactures,
}: {
  name: string
  address: string | null
  status: ChantierStatus
  clientName: string | null
  budget: number | null
  startDate: string | null
  endDateEstimated: string | null
  progressPercent: number | null
  linkedDevis: LinkedDevis[]
  linkedFactures: LinkedFacture[]
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-brand-line bg-white">
      <div className="bg-gradient-to-br from-brand-navy to-brand-navy-2 p-5 text-white">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-white/[0.16] px-2.5 py-0.5 text-[11px] font-bold text-white">
            {chantierStatusLabels[status]}
          </span>
        </div>
        <h1 className="text-lg font-extrabold tracking-tight">{name}</h1>
        {address && (
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-white/60">
            <MapPinIcon className="size-3" />
            {address}
          </div>
        )}
        {progressPercent !== null && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-white/60">Avancement global</span>
              <span className="text-[13px] font-extrabold">{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-brand-accent"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px bg-[#eef2f7] sm:grid-cols-4">
        <Fact label="Client" value={clientName || "—"} />
        <Fact
          label="Budget"
          value={budget !== null ? `${budget.toLocaleString("fr-FR")} €` : "—"}
        />
        <Fact label="Début" value={startDate || "—"} />
        <Fact label="Fin estimée" value={endDateEstimated || "—"} />
      </div>

      {(linkedDevis.length > 0 || linkedFactures.length > 0) && (
        <div className="px-4.5 py-4">
          <div className="mb-2.5 text-xs font-bold text-brand-navy">Documents liés</div>
          <div className="flex flex-col gap-2">
            {linkedDevis.map((devis) => (
              <Link
                key={devis.id}
                href={`/devis/${devis.id}`}
                className="flex items-center gap-3 rounded-[11px] border border-brand-line px-3 py-2.5 hover:bg-brand-bg-soft"
              >
                <div className="flex size-8 flex-none items-center justify-center rounded-[9px] bg-brand-navy/[0.07]">
                  <FileTextIcon className="size-4 text-brand-navy" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-brand-ink">{devis.number}</div>
                  <div className="text-[11px] text-brand-muted-2">
                    {devis.amount_ttc.toFixed(2)} €
                  </div>
                </div>
                <DevisStatusBadge status={devis.status} />
              </Link>
            ))}
            {linkedFactures.map((facture) => (
              <Link
                key={facture.id}
                href={`/factures/${facture.id}`}
                className="flex items-center gap-3 rounded-[11px] border border-brand-line px-3 py-2.5 hover:bg-brand-bg-soft"
              >
                <div className="flex size-8 flex-none items-center justify-center rounded-[9px] bg-brand-accent/[0.1]">
                  <ReceiptIcon className="size-4 text-brand-accent-hover" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-brand-ink">{facture.number}</div>
                  <div className="text-[11px] text-brand-muted-2">
                    {facture.amount_ttc.toFixed(2)} €
                  </div>
                </div>
                <FactureStatusBadge status={facture.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4.5 py-3.5">
      <div className="mb-1 text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
        {label}
      </div>
      <div className="text-[13px] font-semibold text-brand-ink">{value}</div>
    </div>
  )
}

