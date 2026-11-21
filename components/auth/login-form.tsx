"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCard, ClipRow } from "@/components/auth/clipboard-card";
import { createBrowserClient } from "@/lib/supabase/browser";
import { safeNextPath } from "@/lib/auth/redirect";

const EMAIL_RE = /\S+@\S+\.\S+/;

/**
 * Login form (spec §2.2). Invalid credentials surface the Supabase Auth
 * built-in message inline. On success the user lands on their ?next target
 * or "/" (which gates itself to onboarding when they have no workspace).
 *
 * @param next Raw ?next value; validated here via the shared helper.
 */
export function LoginForm({ next }: { next: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createBrowserClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }
    router.push(safeNextPath(next ?? undefined) ?? "/");
    router.refresh();
  }

  return (
    <ClipboardCard
      kicker="FORM A-01 — CREW"
      title="Welcome back"
      subtitle="Log in to open your workspace."
      stamp="REV. A · LOGIN"
      footer={
        <>
          No account yet?{" "}
          <Link href={{ pathname: "/auth/signup", query: next ? { next } : {} }}>
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-2">
        <ClipRow label="Email" htmlFor="email" ok={EMAIL_RE.test(email)} index={0}>
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
        <ClipRow label="Password" htmlFor="password" ok={password.length > 0} index={1}>
          <input
            id="password"
            className="clip-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </ClipRow>
        {error && (
          <p className="clip-error" role="alert">
            {error}
          </p>
        )}
        <div className="mt-4">
          <Button
            type="submit"
            className="h-11 w-full bg-[var(--hard-hat)] text-base font-bold text-[var(--graphite)] shadow-[3px_3px_0_var(--graphite)] hover:bg-[var(--hard-hat)]/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            disabled={pending}
          >
            {pending ? "Logging in…" : "Log in"}
          </Button>
        </div>
      </form>
    </ClipboardCard>
  );
}
