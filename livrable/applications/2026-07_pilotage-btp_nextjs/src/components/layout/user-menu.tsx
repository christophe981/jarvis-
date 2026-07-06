"use client"

import { ChevronDownIcon, LogOutIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/actions/auth"

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function UserMenu({ name, subtitle }: { name: string; subtitle?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex cursor-pointer items-center gap-2.5 rounded-[11px] border border-brand-line py-1 pr-2 pl-1" />
        }
      >
        <div className="flex size-8 items-center justify-center rounded-[9px] bg-brand-navy text-[12.5px] font-bold text-white">
          {initials(name) || "?"}
        </div>
        <div className="text-left leading-tight">
          <div className="text-[12.5px] font-semibold text-brand-ink">{name}</div>
          {subtitle && <div className="text-[10.5px] text-brand-muted-2">{subtitle}</div>}
        </div>
        <ChevronDownIcon className="size-[15px] text-brand-muted-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href="/parametres/abonnement" />}>
          <SettingsIcon className="size-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut} className="contents">
          <DropdownMenuItem variant="destructive" render={<button type="submit" />}>
            <LogOutIcon className="size-4" />
            Déconnexion
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
