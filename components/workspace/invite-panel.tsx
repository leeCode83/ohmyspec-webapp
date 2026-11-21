"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from "@/lib/supabase/browser";

/**
 * Owner invite panel (spec §2.7): fetches the code from workspace_invites
 * (RLS owner-only — members receive the code in no payload, audit F1),
 * shows the join link, and offers copy. Regeneration is mounted beside it
 * by the mutations task.
 */
export function InvitePanel({ workspaceId }: { workspaceId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite link</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Input readOnly value={joinUrl} aria-label="Invite link" />
        <Button variant="outline" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </CardContent>
    </Card>
  );
}
