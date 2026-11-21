/**
 * Validates an untrusted `?next=` query value before redirecting (audit F4).
 *
 * A `next` value is used only if it starts with a single "/" and does not
 * start with "//" — anything else (absolute or protocol-relative URL) is an
 * open redirect and returns null so the caller can fall back to its own
 * safe default. Enforced HERE ONLY, never re-implemented per page.
 *
 * @param raw The raw search-param value (string, array, or undefined).
 * @returns The safe in-app path, or null when it must be ignored.
 */
export function safeNextPath(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}
