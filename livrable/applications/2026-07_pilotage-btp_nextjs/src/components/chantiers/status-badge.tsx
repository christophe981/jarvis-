import { chantierStatusLabels, type ChantierStatus } from "@/lib/validations/chantiers"
import { cn } from "@/lib/utils"

const STYLES: Record<ChantierStatus, string> = {
  a_venir: "bg-brand-navy/[0.08] text-[#2f5c86]",
  en_cours: "bg-brand-accent/[0.13] text-[#c85e08]",
  termine: "bg-[#168c5a]/[0.13] text-[#157a4e]",
  archive: "bg-brand-muted-2/[0.13] text-brand-muted",
}

export function StatusBadge({ status }: { status: ChantierStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        STYLES[status]
      )}
    >
      {chantierStatusLabels[status]}
    </span>
  )
}
