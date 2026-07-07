import { factureStatusLabels, type FactureStatusValue } from "@/lib/validations/factures"
import { cn } from "@/lib/utils"

const STYLES: Record<FactureStatusValue, string> = {
  brouillon: "bg-brand-muted-2/[0.13] text-brand-muted",
  envoyee: "bg-brand-navy/[0.08] text-[#2f5c86]",
  payee_partielle: "bg-brand-navy/[0.08] text-[#2f5c86]",
  payee: "bg-[#168c5a]/[0.13] text-[#157a4e]",
  en_retard: "bg-brand-accent/[0.13] text-[#c85e08]",
  annulee: "bg-brand-muted-2/[0.13] text-brand-muted",
}

export function FactureStatusBadge({ status }: { status: FactureStatusValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        STYLES[status]
      )}
    >
      {factureStatusLabels[status]}
    </span>
  )
}
