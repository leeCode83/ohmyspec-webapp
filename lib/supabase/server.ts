import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for server components (RSC).
 *
 * Reads the session from httpOnly auth cookies set by proxy.ts. Every query
 * runs under the caller's identity, so Postgres RLS is the sole
 * authorization layer. Cookie writes are best-effort: server components
 * cannot set cookies, and that is fine — proxy.ts refreshes sessions.
 *
 * @returns An RLS-scoped Supabase client bound to the request cookies.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a server component — proxy.ts already handles
            // session refresh; safe to ignore per @supabase/ssr docs.
          }
        },
      },
    },
  );
}
