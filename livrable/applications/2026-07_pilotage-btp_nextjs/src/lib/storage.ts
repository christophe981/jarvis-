import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database.types"

const BUCKET = "chantier-photos"
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const MAX_SIZE_BYTES = 10 * 1024 * 1024

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Format non supporté (JPEG, PNG, WEBP, HEIC)"
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Fichier trop lourd (10 Mo maximum)"
  }
  return null
}

// Upload direct depuis le navigateur (jamais via une Server Action, limitée à 1 Mo
// par défaut). Retourne le CHEMIN de storage, pas une URL : le bucket est privé,
// l'URL affichable est générée à la demande via getSignedPhotoUrl.
export async function uploadChantierPhoto(
  supabase: SupabaseClient<Database>,
  params: { orgId: string; chantierId: string; file: File }
): Promise<string> {
  const ext = params.file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${params.orgId}/${params.chantierId}/${crypto.randomUUID()}.${ext}`

  const { data, error } = await supabase.storage.from(BUCKET).upload(path, params.file, {
    cacheControl: "3600",
    contentType: params.file.type,
    upsert: false,
  })
  if (error) throw error

  return data.path
}

export async function getSignedPhotoUrl(
  supabase: SupabaseClient<Database>,
  path: string,
  expiresIn = 300
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn)
  if (error) return null
  return data.signedUrl
}
