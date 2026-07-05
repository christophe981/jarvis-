import { ManageSubscriptionButton, SubscribeButton } from "@/components/billing/subscribe-button"
import { Badge } from "@/components/ui/badge"
import { getActiveOrg } from "@/lib/supabase/org"

const STATUS_LABELS: Record<string, string> = {
  incomplete: "Incomplet",
  incomplete_expired: "Expiré (non finalisé)",
  trialing: "Essai en cours",
  active: "Actif",
  past_due: "Paiement en retard",
  canceled: "Annulé",
  unpaid: "Impayé",
  paused: "En pause",
}

const ACTIVE_STATUSES = ["active", "trialing"]

export default async function AbonnementPage() {
  const { supabase, orgId } = await getActiveOrg()

  const { data: subscription } = orgId
    ? await supabase.from("subscriptions").select("*").eq("org_id", orgId).maybeSingle()
    : { data: null }

  const isActive = subscription ? ACTIVE_STATUSES.includes(subscription.status) : false

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#0f2742]">Abonnement</h1>

      <div className="max-w-md rounded-xl border border-[#e3e9f0] p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Statut</span>
          {subscription ? (
            <Badge variant={isActive ? "default" : "secondary"}>
              {STATUS_LABELS[subscription.status] ?? subscription.status}
            </Badge>
          ) : (
            <Badge variant="secondary">Aucun abonnement</Badge>
          )}
        </div>

        {subscription?.current_period_end && (
          <p className="mb-4 text-sm text-muted-foreground">
            Prochaine échéance :{" "}
            {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
          </p>
        )}

        {isActive ? <ManageSubscriptionButton /> : <SubscribeButton />}
      </div>
    </div>
  )
}
