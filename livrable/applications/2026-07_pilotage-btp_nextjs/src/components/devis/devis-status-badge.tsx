import { devisStatusLabels, type DevisStatusValue } from "@/lib/validations/devis"
import { cn } from "@/lib/utils"

const STYLES: Record<DevisStatusValue, string> = {
  brouillon: "bg-brand-muted-2/[0.13] text-brand-muted",
  envoye: "bg-brand-navy/[0.08] text-[#2f5c86]",
  accepte: "bg-[#168c5a]/[0.13] text-[#157a4e]",
  refuse: "bg-[#c14a2b]/[0.12] text-[#c14a2b]",
  expire: "bg-brand-muted-2/[0.13] text-brand-muted",
}

export function DevisStatusBadge({ status }: { status: DevisStatusValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        STYLES[status]
      )}
    >
      {devisStatusLabels[status]}
    </span>
  )
}
