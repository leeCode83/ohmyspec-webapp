"use client";

import { PASSWORD_RULES } from "@/lib/auth/password-rules";

/**
 * Live password checklist mirroring the server policy (spec §2.1). Each
 * rule renders as a checkable item; purely presentational — submit gating
 * lives in the form.
 *
 * @param password The current password field value.
 */
export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="space-y-1 text-sm" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <li key={rule.id} className={ok ? "text-emerald-600" : "text-muted-foreground"}>
            {ok ? "✓" : "○"} {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
