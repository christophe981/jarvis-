import { Badge } from "@/components/ui/badge"
import { chantierStatusLabels, type ChantierStatus } from "@/lib/validations/chantiers"

const VARIANTS: Record<ChantierStatus, "secondary" | "default" | "outline"> = {
  a_venir: "secondary",
  en_cours: "default",
  termine: "outline",
  archive: "outline",
}

export function StatusBadge({ status }: { status: ChantierStatus }) {
  return <Badge variant={VARIANTS[status]}>{chantierStatusLabels[status]}</Badge>
}
