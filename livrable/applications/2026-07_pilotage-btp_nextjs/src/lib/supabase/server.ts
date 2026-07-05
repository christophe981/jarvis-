import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { Database } from "@/types/database.types"

// A appeler dans les Server Components, Server Actions et Route Handlers.
// L'écriture de cookies échoue silencieusement dans un Server Component pur
// (rendu) : c'est proxy.ts qui rafraîchit la session sur chaque requête.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Appelé depuis un Server Component pur : ignoré, proxy.ts s'en charge.
          }
        },
      },
    }
  )
}
