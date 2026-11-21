/**
 * The dumb auth routing decision for proxy.ts (spec §1): authenticated vs
 * anonymous only. It NEVER queries business tables — workspace gating
 * lives in server layouts, onboarding gating in the pages themselves.
 * Pure function so it is unit-testable without Next.js.
 *
 * @param pathname The request pathname.
 * @param isAuthenticated Result of supabase.auth.getUser().
 * @returns Redirect target URL, or null to pass through.
 */
export function resolveAuthRedirect(
  pathname: string,
  isAuthenticated: boolean,
): string | null {
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/signup";
  if (isAuthPage) {
    return isAuthenticated ? "/" : null;
  }

  const needsAuth =
    pathname.startsWith("/w/") || pathname === "/onboarding";
  if (!isAuthenticated && needsAuth) {
    return `/auth/login?next=${encodeURIComponent(pathname)}`;
  }

  return null;
}
