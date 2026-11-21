"use client";

import { PASSWORD_RULES } from "@/lib/auth/password-rules";

/**
 * Live password checklist mirroring the server policy (spec §2.1). Each
 * rule renders as a mono ruled item; purely presentational — submit gating
 * lives in the form.
 *
 * @param password The current password field value.
 */
export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="space-y-1" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-1.5 font-mono text-[0.75rem] font-semibold tracking-wide ${
              ok ? "text-[var(--redline)]" : "text-muted-foreground"
            }`}
          >
            <span aria-hidden className="inline-block w-4 text-center">
              {ok ? "✓" : "·"}
            </span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
