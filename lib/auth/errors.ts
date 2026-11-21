/**
 * Thin whitelist over the backend spec §5 error table (audit F6). Known
 * messages render as-is near the action; anything unexpected renders the
 * generic fallback — and the CALLER additionally shows the raw Postgres
 * error in a collapsible mono <details> block, deliberately kept so
 * failures stay debuggable (user-approved exception to hiding details).
 *
 * Supabase Auth built-in messages (login/signup forms) do not pass through
 * here — they are already user-facing and shown as-is.
 */
const KNOWN_DB_MESSAGES = [
  "This invite link is invalid or the workspace was deleted",
  "This workspace is full (10 members max)",
  "You are already a member of this workspace",
  "The owner cannot leave or remove themselves",
  "Workspace name cannot be empty",
  "Not authorized",
] as const;

// CHECK violations (SQLSTATE 23514) carry raw Postgres messages that are
// neither stable nor user-facing, so they map by code. Today only the
// workspace_name_valid constraint is reachable from client writes; add
// per-constraint entries if another constraint ever surfaces to a user
// action (workspace CRUD spec 2026-11-21 §3).
const SQLSTATE_MESSAGES: Record<string, string> = {
  "23514": "Workspace name must be 1-60 characters",
};

export const GENERIC_ERROR_MESSAGE = "Something went wrong";

/**
 * @param error Anything thrown or returned as `error` by a supabase call.
 * @returns The message to render inline.
 */
export function toUserMessage(
  error: { message?: string; code?: string } | null | undefined,
): string {
  const codeMessage = error?.code ? SQLSTATE_MESSAGES[error.code] : undefined;
  if (codeMessage) {
    return codeMessage;
  }
  const message = error?.message ?? "";
  if ((KNOWN_DB_MESSAGES as readonly string[]).includes(message)) {
    return message;
  }
  return GENERIC_ERROR_MESSAGE;
}

/**
 * True when the caller must render the raw error in the collapsible
 * technical-details block (i.e. the whitelist did not match).
 *
 * @param error The supabase error object.
 * @returns Whether the details block should be shown.
 */
export function shouldShowTechnicalDetails(
  error: { message?: string } | null | undefined,
): boolean {
  return toUserMessage(error) === GENERIC_ERROR_MESSAGE;
}
