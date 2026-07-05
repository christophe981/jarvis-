import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: membership } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", user?.id ?? "")
    .eq("status", "active")
    .limit(1)
    .maybeSingle()

  let orgName = "—"
  if (membership?.org_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", membership.org_id)
      .single()
    orgName = org?.name ?? "—"
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[#0f2742]">
          Bienvenue, {orgName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Ce dashboard est un squelette temporaire, en attente de l&apos;interface
          générée sur Claude Design.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Chantiers en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Devis en attente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Factures en retard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              CA du mois
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0 €</CardContent>
        </Card>
      </div>
    </div>
  )
}
