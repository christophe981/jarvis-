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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-brand-navy">Clients</h1>
          <p className="mt-1 text-[13.5px] text-brand-muted">
            {clients?.length ?? 0} client{(clients?.length ?? 0) !== 1 ? "s" : ""} de votre
            entreprise.
          </p>
        </div>
        <NewClientDialog />
      </div>

      {clients && clients.length > 0 ? (
        <div className="overflow-hidden rounded-[14px] border border-brand-line bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8fafd]">
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Nom
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Entreprise
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Email
                </TableHead>
                <TableHead className="text-[10.5px] font-bold tracking-wide text-brand-muted-2 uppercase">
                  Téléphone
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="text-[13px] font-semibold text-brand-ink">
                    {client.name}
                  </TableCell>
                  <TableCell className="text-[12.5px] text-brand-muted">
                    {client.company_name || "—"}
                  </TableCell>
                  <TableCell className="text-[12.5px] text-brand-muted">
                    {client.email || "—"}
                  </TableCell>
                  <TableCell className="text-[12.5px] text-brand-muted">
                    {client.phone || "—"}
                  </TableCell>
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
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-brand-line py-16 text-center">
          <p className="text-[13px] text-brand-muted">Aucun client pour l&apos;instant.</p>
          <NewClientDialog />
        </div>
      )}
    </div>
  )
}
