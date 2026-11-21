import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client bound to a proxy.ts request/response pair.
 *
 * Writes refreshed session cookies onto BOTH the request (so downstream
 * server components see the fresh session) and the response (so the browser
 * stores it). This is the @supabase/ssr Next.js pattern; without it users
 * get random logouts.
 *
 * @param request The incoming proxy request.
 * @returns The client plus a getter for the (possibly replaced) response.
 */
export function createProxyClient(request: NextRequest): {
  supabase: SupabaseClient;
  getResponse: () => NextResponse;
} {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return { supabase, getResponse: () => response };
}
