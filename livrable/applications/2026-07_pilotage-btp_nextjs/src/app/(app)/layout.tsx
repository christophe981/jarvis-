import Link from "next/link"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions/auth"
import { createClient } from "@/lib/supabase/server"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/chantiers", label: "Chantiers" },
  { href: "/devis", label: "Devis" },
  { href: "/factures", label: "Factures" },
  { href: "/relances", label: "Relances" },
  { href: "/rapports", label: "Rapports" },
]

// Squelette temporaire : la version finale de cette interface viendra du
// prompt Claude Design "App shell + Dashboard" (voir plan MVP).
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col justify-between bg-[#0f2742] p-4 text-white">
        <div>
          <p className="mb-6 px-2 text-sm font-semibold tracking-wide text-white/70">
            Pilotage BTP
          </p>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-1.5 text-sm text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
          >
            Déconnexion
          </Button>
        </form>
      </aside>
      <div className="flex-1 bg-[#f5f8fc]">
        <header className="flex items-center justify-end border-b border-[#e3e9f0] bg-white px-6 py-3">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
