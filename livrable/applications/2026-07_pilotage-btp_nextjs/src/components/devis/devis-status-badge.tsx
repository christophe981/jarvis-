import { Badge } from "@/components/ui/badge"
import { devisStatusLabels, type DevisStatusValue } from "@/lib/validations/devis"

const VARIANTS: Record<DevisStatusValue, "secondary" | "default" | "outline" | "destructive"> = {
  brouillon: "secondary",
  envoye: "default",
  accepte: "outline",
  refuse: "destructive",
  expire: "destructive",
}

export function DevisStatusBadge({ status }: { status: DevisStatusValue }) {
  return <Badge variant={VARIANTS[status]}>{devisStatusLabels[status]}</Badge>
}
