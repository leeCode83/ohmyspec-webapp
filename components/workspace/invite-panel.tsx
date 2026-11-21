"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createBrowserClient } from "@/lib/supabase/browser";
import { shouldShowTechnicalDetails, toUserMessage } from "@/lib/auth/errors";

/**
 * Owner invite panel (spec §2.7): fetches the code from workspace_invites
 * (RLS owner-only — members receive the code in no payload, audit F1),
 * shows the join link, offers copy, and regenerates on confirmation —
 * old links die immediately and the panel re-fetches with the new code.
 */
export function InvitePanel({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("workspace_invites")
        .select("code")
        .eq("workspace_id", workspaceId)
        .maybeSingle();
      setCode(data?.code ?? null);
    }
    load();
  }, [workspaceId]);

  if (!code) return null;

  const joinUrl = `${window.location.origin}/join/${code}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function regenerate(): Promise<string | null> {
    setError(null);
    const supabase = createBrowserClient();
    const { data, error: rpcError } = await supabase.rpc("regenerate_invite", {
      ws: workspaceId,
    });
    if (rpcError) {
      setError(rpcError);
      return rpcError.message;
    }
    setCode(data ?? null);
    router.refresh();
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Input readOnly value={joinUrl} aria-label="Invite link" />
          <Button variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <div className="mt-3">
          <ConfirmDialog
            trigger={<Button variant="destructive">Regenerate</Button>}
            title="Regenerate invite code?"
            description="Old invite links stop working immediately."
            confirmLabel="Regenerate"
            destructive
            onConfirm={regenerate}
          />
        </div>
        {error && (
          <div role="alert" className="mt-2">
            <p className="text-sm text-red-600">{toUserMessage(error)}</p>
            {shouldShowTechnicalDetails(error) && (
              <details className="mt-1 text-xs font-mono text-muted-foreground">
                <summary>Technical details</summary>
                {error.message}
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
