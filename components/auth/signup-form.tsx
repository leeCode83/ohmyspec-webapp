"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCard, ClipRow } from "@/components/auth/clipboard-card";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { createBrowserClient } from "@/lib/supabase/browser";
import { passwordIsStrong } from "@/lib/auth/password-rules";

const EMAIL_RE = /\S+@\S+\.\S+/;

/**
 * Signup form (spec §2.1). Name rides in options.data.name so the
 * on_auth_user_created trigger fills profiles. On success the user has a
 * session immediately (no email verification) and lands on their ?next
 * target or onboarding — a fresh user has no workspace.
 *
 * @param next Validated ?next value (already passed through safeNextPath).
 */
export function SignupForm({ next }: { next: string | null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!passwordIsStrong(password)) return; // checklist blocks submit
    setPending(true);
    const supabase = createBrowserClient();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setPending(false);

    if (signupError) {
      // Supabase Auth built-in messages are user-facing; shown as-is (spec §3).
      setError(signupError.message);
      return;
    }
    router.push(next ?? "/onboarding");
  }

  return (
    <ClipboardCard
      kicker="FORM A-02 — CREW"
      title="Join the crew"
      subtitle="Create an account and start closing specs."
      stamp="REV. A · NEW"
      footer={
        <>
          Already have an account? <Link href="/auth/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-1">
        <ClipRow label="Name" htmlFor="name" ok={name.trim().length >= 2} index={0}>
          <input
            id="name"
            className="clip-input"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </ClipRow>
        <ClipRow label="Email" htmlFor="email" ok={EMAIL_RE.test(email)} index={1}>
          <input
            id="email"
            className="clip-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </ClipRow>
        <ClipRow label="Password" htmlFor="password" ok={passwordIsStrong(password)} index={2}>
          <input
            id="password"
            className="clip-input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPwFocused(true)}
            onBlur={() => setPwFocused(false)}
            required
            aria-describedby="password-checklist"
          />
          {/* Checklist only shows while choosing/typing the password */}
          {(pwFocused || password.length > 0) && (
            <div id="password-checklist" className="mt-1">
              <PasswordChecklist password={password} />
            </div>
          )}
        </ClipRow>
        {error && (
          <p className="clip-error" role="alert">
            {error}
          </p>
        )}
        <div className="mt-3">
          <Button
            type="submit"
            className="h-10 w-full bg-[var(--hard-hat)] text-base font-bold text-[var(--graphite)] shadow-[3px_3px_0_var(--graphite)] hover:bg-[var(--hard-hat)]/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            disabled={pending}
          >
            {pending ? "Signing up…" : "Sign up"}
          </Button>
        </div>
      </form>
    </ClipboardCard>
  );
}
