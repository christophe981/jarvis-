import { NewClientDialog } from "@/components/clients/new-client-dialog"
import { ClientRowActions } from "@/components/clients/client-row-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getActiveOrg } from "@/lib/supabase/org"

export default async function ClientsPage() {
  const { supabase, orgId } = await getActiveOrg()

  const { data: clients } = orgId
    ? await supabase
        .from("clients")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
    : { data: [] }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0f2742]">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Les clients de votre entreprise.
          </p>
        </div>
        <NewClientDialog />
      </div>

      {clients && clients.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.company_name || "—"}</TableCell>
                <TableCell>{client.email || "—"}</TableCell>
                <TableCell>{client.phone || "—"}</TableCell>
                <TableCell>
                  <ClientRowActions
                    clientId={client.id}
                    client={{
                      name: client.name,
                      companyName: client.company_name ?? "",
                      email: client.email ?? "",
                      phone: client.phone ?? "",
                      address: client.address ?? "",
                      siret: client.siret ?? "",
                      notes: client.notes ?? "",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#e3e9f0] py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Aucun client pour l&apos;instant.
          </p>
          <NewClientDialog />
        </div>
      )}
    </div>
  )
}
