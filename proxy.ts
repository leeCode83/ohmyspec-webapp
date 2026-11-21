import { NextResponse, type NextRequest } from "next/server";
import { resolveAuthRedirect } from "@/lib/auth/proxy-logic";
import { createProxyClient } from "@/lib/supabase/proxy";

/**
 * Dumb session gate (spec §1): refreshes the session cookies and applies
 * the authenticated-vs-anonymous routing decision. It must stay dumb —
 * never query business tables here; workspace gating lives in layouts.
 */
export async function proxy(request: NextRequest) {
  const { supabase, getResponse } = createProxyClient(request);

  // getUser() validates the JWT against the auth server — never getSession(),
  // which trusts unverified cookie content.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirect = resolveAuthRedirect(request.nextUrl.pathname, Boolean(user));
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return getResponse();
}

export const config = {
  matcher: [
    // Run on everything except static assets and Next internals.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
