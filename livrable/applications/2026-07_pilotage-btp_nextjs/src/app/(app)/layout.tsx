import { AppSidebar } from "@/components/layout/app-sidebar"
import { UserMenu } from "@/components/layout/user-menu"
import { getActiveOrg } from "@/lib/supabase/org"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { supabase, orgId, userId } = await getActiveOrg()

  let orgName = "—"
  let userName = "Mon compte"

  if (orgId) {
    const { data: org } = await supabase.from("organizations").select("name").eq("id", orgId).single()
    orgName = org?.name ?? "—"
  }
  if (userId) {
    const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", userId).single()
    userName = profile?.full_name || profile?.email || "Mon compte"
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 bg-brand-bg-soft">
        <header className="flex h-[62px] items-center justify-between border-b border-brand-line bg-white px-6">
          <span className="text-sm font-bold text-brand-navy">{orgName}</span>
          <UserMenu name={userName} />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
