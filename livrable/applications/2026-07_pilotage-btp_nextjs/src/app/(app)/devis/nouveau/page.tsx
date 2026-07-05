import { DevisForm } from "@/components/devis/devis-form"
import { getActiveOrg } from "@/lib/supabase/org"

export default async function NouveauDevisPage() {
  const { supabase, orgId } = await getActiveOrg()

  const [{ data: clients }, { data: chantiers }] = orgId
    ? await Promise.all([
        supabase.from("clients").select("id, name").eq("org_id", orgId),
        supabase.from("chantiers").select("id, name").eq("org_id", orgId),
      ])
    : [{ data: [] }, { data: [] }]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#0f2742]">Nouveau devis</h1>
      <div className="max-w-2xl">
        <DevisForm clients={clients ?? []} chantiers={chantiers ?? []} />
      </div>
    </div>
  )
}
