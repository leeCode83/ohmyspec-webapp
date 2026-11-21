"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase/browser";
import { shouldShowTechnicalDetails, toUserMessage } from "@/lib/auth/errors";

/**
 * Collapsible block showing the raw Postgres error for unexpected failures
 * (audit F6, user-approved). Module-level so it is not recreated during
 * render (react-hooks/static-components).
 */
function TechnicalDetails({ error }: { error: { message: string } | null }) {
  if (!error || !shouldShowTechnicalDetails(error)) return null;
  return (
    <details className="mt-1 text-xs font-mono text-muted-foreground">
      <summary>Technical details</summary>
      {error.message}
    </details>
  );
}

/**
 * The two equal onboarding paths (spec §2.4): create a first workspace or
 * join one by invite code. Both call security-definer RPCs; errors surface
 * inline per the backend error table, unexpected ones with the raw error
 * in a collapsible details block (audit F6, user-approved).
 */
export function OnboardingForms() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [createError, setCreateError] = useState<{ message: string } | null>(null);
  const [joinError, setJoinError] = useState<{ message: string } | null>(null);
  const [pending, setPending] = useState<"create" | "join" | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setPending("create");
    const supabase = createBrowserClient();
    const { error } = await supabase.rpc("create_workspace", {
      p_name: workspaceName,
    });
    setPending(null);
    if (error) {
      setCreateError(error);
      return;
    }
    router.push("/"); // dashboard
  }

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoinError(null);
    setPending("join");
    const supabase = createBrowserClient();
    const { data, error } = await supabase.rpc("join_workspace", {
      p_invite_code: inviteCode.trim(),
    });
    setPending(null);
    if (error) {
      setJoinError(error);
      return;
    }
    router.push(`/w/${data}`);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create your first workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />
            </div>
            {createError && (
              <div role="alert">
                <p className="text-sm text-red-600">{toUserMessage(createError)}</p>
                <TechnicalDetails error={createError} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={pending !== null}>
              {pending === "create" ? "Creating…" : "Create workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join with an invite code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-code">Invite code</Label>
              <Input
                id="invite-code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>
            {joinError && (
              <div role="alert">
                <p className="text-sm text-red-600">{toUserMessage(joinError)}</p>
                <TechnicalDetails error={joinError} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={pending !== null}>
              {pending === "join" ? "Joining…" : "Join workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
