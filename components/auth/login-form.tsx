"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase/browser";
import { safeNextPath } from "@/lib/auth/redirect";

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
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          No account yet?{" "}
          <Link className="underline" href={{ pathname: "/auth/signup", query: next ? { next } : {} }}>
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
