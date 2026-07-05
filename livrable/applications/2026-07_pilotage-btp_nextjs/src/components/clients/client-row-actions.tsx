"use client"

import { MoreHorizontalIcon } from "lucide-react"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClientForm } from "@/components/clients/client-form"
import { deleteClientRecord } from "@/lib/actions/clients"
import type { ClientInput } from "@/lib/validations/clients"

export function ClientRowActions({
  clientId,
  client,
}: {
  clientId: string
  client: ClientInput
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [isDeleting, startDeleteTransition] = useTransition()

  const handleDelete = () => {
    if (!window.confirm(`Supprimer le client "${client.name}" ?`)) return
    startDeleteTransition(async () => {
      await deleteClientRecord(clientId)
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {client.name}</DialogTitle>
          </DialogHeader>
          <ClientForm
            clientId={clientId}
            defaultValues={client}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
