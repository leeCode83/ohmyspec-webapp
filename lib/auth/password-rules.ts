/**
 * Client-side mirror of the Supabase Auth password policy configured in
 * `supabase/config.toml` (min length 8 + lower/upper/digit/symbol).
 * The server remains the source of truth — this drives the signup
 * checklist UI so users see the rules before submitting (spec §2.1).
 */

export interface PasswordRule {
  /** Stable identifier used as React key and test id. */
  id: string;
  /** User-facing checklist label. */
  label: string;
  /** Whether the password satisfies this rule. */
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A–Z)", test: (pw) => /[A-Z]/.test(pw) },
  { id: "lowercase", label: "One lowercase letter (a–z)", test: (pw) => /[a-z]/.test(pw) },
  { id: "digit", label: "One digit (0–9)", test: (pw) => /\d/.test(pw) },
  { id: "symbol", label: "One symbol (e.g. !@#$)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

/**
 * @param password The candidate password.
 * @returns True when every server-side rule passes.
 */
export function passwordIsStrong(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
