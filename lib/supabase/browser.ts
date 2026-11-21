import { createBrowserClient as createClientSsr } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for client components (mutations: auth calls, RPCs, row
 * deletes). `@supabase/ssr` already caches a per-browser singleton, so
 * calling this repeatedly is safe and session-consistent.
 *
 * @returns A Supabase client persisting the session in browser cookies.
 */
export function createBrowserClient(): SupabaseClient {
  return createClientSsr(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
