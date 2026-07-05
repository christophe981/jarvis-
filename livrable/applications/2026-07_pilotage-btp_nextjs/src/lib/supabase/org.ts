import { createClient } from "@/lib/supabase/server"

export async function getActiveOrg() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { supabase, orgId: null as string | null, userId: null as string | null }
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle()

  return { supabase, orgId: membership?.org_id ?? null, userId: user.id }
}
