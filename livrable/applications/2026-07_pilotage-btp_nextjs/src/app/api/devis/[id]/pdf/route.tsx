import { renderToBuffer } from "@react-pdf/renderer"
import { NextResponse } from "next/server"

import { DevisDocument } from "@/lib/pdf/devis-document"
import { getActiveOrg } from "@/lib/supabase/org"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { supabase, orgId } = await getActiveOrg()

  if (!orgId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { data: devis } = await supabase
    .from("devis")
    .select("*, clients(name), chantiers(name), organizations(name)")
    .eq("id", id)
    .eq("org_id", orgId)
    .single()

  if (!devis) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })
  }

  const { data: lines } = await supabase
    .from("devis_lines")
    .select("*")
    .eq("devis_id", id)
    .order("position", { ascending: true })

  const buffer = await renderToBuffer(
    <DevisDocument
      orgName={(devis.organizations as { name?: string } | null)?.name ?? "Pilotage BTP"}
      number={devis.number}
      status={devis.status}
      issuedDate={devis.issued_date}
      validUntil={devis.valid_until}
      clientName={(devis.clients as { name?: string } | null)?.name ?? "—"}
      chantierName={(devis.chantiers as { name?: string } | null)?.name ?? null}
      lines={(lines ?? []).map((line) => ({
        description: line.description,
        quantity: Number(line.quantity),
        unit: line.unit,
        unitPrice: Number(line.unit_price),
        total: Number(line.total),
      }))}
      amountHt={Number(devis.amount_ht)}
      tvaRate={Number(devis.tva_rate)}
      amountTtc={Number(devis.amount_ttc)}
      notes={devis.notes}
    />
  )

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${devis.number}.pdf"`,
    },
  })
}
