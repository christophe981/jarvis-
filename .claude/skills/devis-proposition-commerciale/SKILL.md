---
name: devis-proposition-commerciale
description: Generate a commercial quote (devis) and a commercial proposal (proposition commerciale) for Christophe Lachaud (Structurer & Automatiser, BTP automation consulting), based on a recorded Fathom sales call, and prepare a Gmail draft with everything ready to review and send. Always use this skill when the user says things like "je sors d'un appel avec [prospect]", "j'ai eu un call avec [nom]", pastes a Fathom call link, or asks to prepare/generate a devis or une proposition commerciale for a prospect — even if they don't explicitly mention Canva, Fathom, or Gmail by name. Also trigger for "il faut que je relance [prospect] après notre appel" or similar post-call follow-up requests.
---

# Devis & Proposition Commerciale — Christophe Lachaud

## Why this skill exists

Christophe runs dozens of discovery calls with BTP (construction) prospects every week, recorded in Fathom. After each call he needs two documents — a commercial proposal and a priced quote — built fast, on-brand, and accurate to what was actually discussed on the call. This skill turns a call into both documents plus a ready-to-send email draft, with Christophe approving everything before it goes out.

Because a quote is a commitment the business has to honor, accuracy matters more than speed here. Never invent numbers, needs, or commitments that weren't discussed on the call — when something is unclear, ask Christophe rather than guessing.

## Workflow overview

1. Identify the call (via Fathom)
2. Extract the prospect's context (pain points, needs, scope, any pricing signals)
3. Work out the pricing (base grid + adjustments)
4. Generate the proposition commerciale (Canva)
5. Generate the devis chiffré (Canva)
6. Present both to Christophe for review
7. Once approved, export both PDFs locally and prepare the Gmail text draft
8. Christophe attaches the two PDFs by hand and sends it himself — this skill never attaches files or sends email automatically

## Step 1: Identify the call

Christophe will usually just say "je sors d'un appel avec [nom du prospect]" without a link. Use the Fathom tools to find it:
- `find_person` or `search_meetings` with the prospect's name
- If a Fathom URL is given directly, use `get_recording_by_url` instead
- If several calls match, show Christophe the short list (date + title) and ask which one

## Step 2: Extract the context

Pull the meeting summary and, if the summary is thin on specifics, the full transcript (`get_meeting_summary`, `get_meeting_transcript`). Extract:
- **Prospect / company name** and contact details mentioned
- **Pain points** actually stated on the call (don't infer beyond what was said)
- **Scope of what they need** (e.g. quote automation, follow-up automation, site tracking — whatever was actually discussed, not a generic BTP list)
- **Any pricing signals**: budget mentioned, hours estimated, number of users/sites, urgency

If the call doesn't give you enough to build a credible proposal (e.g. it was cut short, or pricing-relevant details are missing), say so to Christophe and ask rather than padding the document with generic filler.

## Step 3: Work out the pricing

Christophe uses a **base pricing grid + case-by-case adjustments** — never invent prices from nothing.

- The base grid lives as an uploaded file Christophe provides (packs, hourly rates). Look for it in `/mnt/user-data/uploads`; if it isn't there yet, ask Christophe for it or for the relevant numbers before finalizing a devis.
- Layer in adjustments based on what was actually said on the call (extra scope, urgency, number of sites/users, etc.) — and note in your response to Christophe *why* you adjusted, so he can sanity-check it before it goes to a client.

## Step 4: Generate the proposition commerciale (Canva)

There's a validated reference design to reuse — **design ID `DAHPSZ9nUF8`** ("Proposition Commerciale — Christophe Lachaud"), 7 pages, built and approved by Christophe. Canva Brand Templates aren't available on his free plan, so reuse it this way instead:

1. `copy-design` on `DAHPSZ9nUF8` to create a fresh copy for this prospect
2. `start-editing-transaction` on the new copy, then `perform-editing-operations` to replace the placeholder text (prospect name, pain points, proposed solutions, benefits, scope/timeline) with content grounded in the actual call
3. **The section structure can and should adapt to the prospect** — Christophe explicitly wants this improvised per deal, not forced into a rigid template. Add, drop, or reweight sections (e.g. skip "site tracking" entirely if it wasn't discussed) so the document reflects this specific conversation, not a generic pitch.
4. Keep the brand identity intact — don't touch the visual styling, only the content:
   - **Company**: Christophe Lachaud — Structurer & Automatiser · BTP
   - **Contact block** (last page + cover): Tél 07 62 00 86 19, contact@christophe-obm.com, plus `SIRET : [à compléter]` and `Validité : [à compléter]` placeholders — leave these two as-is, Christophe fills them by hand per deal
   - **Colors**: navy background (~#0F1E2E), orange accent (~#E8823C), white text
5. `commit-editing-transaction` once the content looks right

## Step 5: Generate the devis chiffré (Canva)

Same tool (Canva), same brand identity, but this is a **separate document** from the proposal — Christophe wants them distinct, not merged. Build it as a clean itemized quote: line items drawn from the pricing grid + adjustments from Step 3, subtotal, total, and the same contact/SIRET/validity block as the proposal for consistency. If no devis template exists yet for a given structure, generate one with `generate-design` (design_type `document` or `report`) using the same navy/orange identity, and treat the first one you build as a new reference to reuse in later runs the same way as the proposal (ask Christophe if he wants to lock it in as the new reference design once he's happy with it).

## Step 6: Present both documents for review

Show Christophe:
- The Canva edit links for both documents
- A short summary of what you extracted from the call and why you priced it the way you did
- A draft of the email itself (see Step 7)

**Wait for his explicit approval before touching Gmail.** He may ask for edits — go back into the relevant editing transaction rather than regenerating from scratch, to avoid losing approved parts.

## Step 7: Prepare the Gmail draft

**Gmail limitation to design around**: `Gmail:create_draft` does NOT support real file attachments (confirmed against the live tool: the `attachments` parameter exists in the schema but the tool itself states attachments aren't supported yet). Text draft creation itself works reliably. So the flow below builds the text draft automatically and leaves Christophe to attach the two PDFs by hand — this is the default, because the prospect receives real, permanent PDF files rather than links that expire.

### Default path — manual attachment (use this unless Christophe asks otherwise)

Once approved:
1. Export both Canva designs as PDF (`export-design`) and hand them to Christophe as **downloadable files**. Tell him to click download on each one — the PDFs then land in his computer's **Downloads** folder (Windows: `Téléchargements`). Important: when this skill runs on claude.ai (web), it executes in a cloud sandbox that CANNOT write to Christophe's own PC folders, so he must download the files himself; they do not appear automatically in his workspace. (Only when the skill runs inside Claude Code on his own machine can you save the PDFs straight into a local folder such as `clients/<prospect>/livrables/`.)
2. `create_draft` in Gmail addressed to the prospect, with a short, warm, professional email body referencing the call. The body should briefly say the proposal and quote are attached.
   - **Font size — lisibilité** : le premier email test reçu par Christophe avait une écriture trop petite. Si le corps est en HTML, ne jamais utiliser de balise `<font size="1|2">` ni de `font-size` inférieur à 15px. Viser une taille de corps de texte d'environ 15-16px (ou simplement laisser le style par défaut de Gmail sans forcer une petite taille). Privilégier du texte simple bien aéré plutôt qu'un HTML à police réduite.
3. Tell Christophe clearly, step by step: the text draft is ready in his Gmail Drafts; he opens it, then **drags the two PDFs from his Downloads folder into the draft** to attach them, then sends it himself.

### Fallback path — Canva links in the body (only if Christophe wants an immediate send and can't attach files)

- Include the Canva export links directly in the email body instead of attaching PDFs.
- **Warn Christophe every time** that these signed links expire after a few hours, so this path only works if he sends the email right away. Re-export fresh links right before he sends if any real time has passed.

### If `create_draft` errors out

Tell Christophe plainly rather than retrying silently — it may be an intermittent tool issue. Hand him the ready-to-paste subject + body so he can create the Gmail draft manually, then attach the two PDFs himself.

**This skill never sends the email itself** — there's no send action available, and more importantly Christophe wants final human review on anything that commits the business to pricing. He clicks send himself from Gmail.

## Things to get right

- **Never fabricate**: pain points, prices, or scope not grounded in the call or the pricing grid. If in doubt, ask Christophe rather than filling the gap.
- **Keep proposal and devis separate** — two documents, not one merged file.
- **Structure adapts per prospect** — resist the urge to reuse the exact same section list every time.
- **Don't touch** the SIRET/validity placeholders or the brand colors/logo — those stay as Christophe set them up.
- **No auto-send** — a Gmail draft is the finish line for this skill, not an email that leaves the building.
