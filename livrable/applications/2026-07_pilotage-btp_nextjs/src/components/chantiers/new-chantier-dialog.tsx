"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChantierForm } from "@/components/chantiers/chantier-form"

export function NewChantierDialog({
  clients,
}: {
  clients: { id: string; name: string }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Nouveau chantier</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau chantier</DialogTitle>
        </DialogHeader>
        <ChantierForm clients={clients} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
