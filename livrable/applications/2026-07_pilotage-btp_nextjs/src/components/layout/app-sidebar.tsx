"use client"

import {
  BarChart3,
  Bell,
  FileText,
  HardHat,
  LayoutGrid,
  Receipt,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/chantiers", label: "Chantiers", icon: HardHat },
  { href: "/devis", label: "Devis", icon: FileText },
  { href: "/factures", label: "Factures", icon: Receipt },
  { href: "/relances", label: "Relances", icon: Bell },
  { href: "/rapports", label: "Rapports", icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[230px] flex-none flex-col bg-brand-navy py-5 text-white">
      <div className="flex items-center gap-3 px-5 pb-6">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand-accent">
          <HardHat className="size-5 text-brand-navy" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-extrabold tracking-tight">Pilotage BTP</div>
          <div className="text-[10.5px] font-medium text-white/50">Gestion TPE</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white",
                isActive && "bg-white/[0.09] font-semibold text-white"
              )}
            >
              {isActive && (
                <span className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-[3px] bg-brand-accent" />
              )}
              <Icon
                className={cn("size-[19px]", isActive ? "text-brand-accent" : "text-white/70")}
                strokeWidth={1.7}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 mt-2 border-t border-white/[0.09] px-0 pt-3">
        <Link
          href="/parametres/abonnement"
          className={cn(
            "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white",
            pathname?.startsWith("/parametres") && "bg-white/[0.09] font-semibold text-white"
          )}
        >
          <Settings className="size-[19px] text-white/70" strokeWidth={1.7} />
          Paramètres &amp; abonnement
        </Link>
      </div>
    </aside>
  )
}
