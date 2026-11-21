"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { createBrowserClient } from "@/lib/supabase/browser";
import { passwordIsStrong } from "@/lib/auth/password-rules";

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
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-describedby="password-checklist"
            />
            <div id="password-checklist">
              <PasswordChecklist password={password} />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing up…" : "Sign up"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="underline" href="/auth/login">Log in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
