import { sendRelanceEmail } from "@/lib/email/brevo"
import { createClient } from "@/lib/supabase/server"

function devisEmailHtml(clientName: string, number: string, amountTtc: number) {
  return `
    <p>Bonjour ${clientName},</p>
    <p>Nous nous permettons de revenir vers vous au sujet du devis <strong>${number}</strong>
    (${amountTtc.toFixed(2)} € TTC) que nous vous avons transmis récemment.</p>
    <p>N'hésitez pas à nous faire part de votre décision ou de toute question.</p>
    <p>Cordialement</p>
  `
}

function factureEmailHtml(clientName: string, number: string, amountTtc: number) {
  return `
    <p>Bonjour ${clientName},</p>
    <p>Sauf erreur de notre part, la facture <strong>${number}</strong>
    (${amountTtc.toFixed(2)} € TTC) demeure impayée à ce jour.</p>
    <p>Merci de bien vouloir procéder au règlement dans les meilleurs délais, ou de nous
    contacter en cas de difficulté.</p>
    <p>Cordialement</p>
  `
}

export async function runRelancesSweep(orgId?: string) {
  const sharedSecret = process.env.SUPABASE_RPC_SHARED_SECRET
  if (!sharedSecret) {
    return { devisCount: 0, facturesCount: 0, errors: 1, error: "SUPABASE_RPC_SHARED_SECRET manquant" }
  }

  const supabase = await createClient()
  let devisCount = 0
  let facturesCount = 0
  let errors = 0

  const { data: devisDues, error: devisError } = await supabase.rpc("get_devis_relances_dues", {
    p_shared_secret: sharedSecret,
    p_org_id: orgId ?? null,
  })
  if (devisError) errors += 1

  for (const devis of devisDues ?? []) {
    if (!devis.client_email) continue
    const result = await sendRelanceEmail({
      to: devis.client_email,
      subject: `Relance : devis ${devis.number}`,
      html: devisEmailHtml(devis.client_name, devis.number, Number(devis.amount_ttc)),
    })
    if (result.success) devisCount += 1
    else errors += 1

    await supabase.rpc("record_relance", {
      p_shared_secret: sharedSecret,
      p_org_id: devis.org_id,
      p_target_type: "devis",
      p_target_id: devis.devis_id,
      p_recipient_email: devis.client_email,
      p_status: result.success ? "envoyee" : "echec",
      p_message_content: devisEmailHtml(devis.client_name, devis.number, Number(devis.amount_ttc)),
      p_error_message: result.success ? null : result.error,
    })
  }

  const { data: facturesDues, error: facturesError } = await supabase.rpc(
    "get_factures_relances_dues",
    { p_shared_secret: sharedSecret, p_org_id: orgId ?? null }
  )
  if (facturesError) errors += 1

  for (const facture of facturesDues ?? []) {
    if (!facture.client_email) continue
    const result = await sendRelanceEmail({
      to: facture.client_email,
      subject: `Relance : facture ${facture.number}`,
      html: factureEmailHtml(facture.client_name, facture.number, Number(facture.amount_ttc)),
    })
    if (result.success) facturesCount += 1
    else errors += 1

    await supabase.rpc("record_relance", {
      p_shared_secret: sharedSecret,
      p_org_id: facture.org_id,
      p_target_type: "facture",
      p_target_id: facture.facture_id,
      p_recipient_email: facture.client_email,
      p_status: result.success ? "envoyee" : "echec",
      p_message_content: factureEmailHtml(facture.client_name, facture.number, Number(facture.amount_ttc)),
      p_error_message: result.success ? null : result.error,
    })
  }

  return { devisCount, facturesCount, errors }
}
