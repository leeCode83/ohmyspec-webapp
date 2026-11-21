"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/browser";
import { shouldShowTechnicalDetails, toUserMessage } from "@/lib/auth/errors";

/**
 * The joining action for an authenticated non-member (spec §2.5). Calls
 * join_workspace and navigates to the workspace on success; errors render
 * inline per the backend error table, unexpected ones with the raw error
 * in the collapsible details block (audit F6).
 *
 * @param workspaceId The workspace the code belongs to.
 * @param inviteCode The invite code from the page URL.
 */
export function JoinButton({
  workspaceId,
  inviteCode,
}: {
  workspaceId: string;
  inviteCode: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<{ message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleJoin() {
    setError(null);
    setPending(true);
    const supabase = createBrowserClient();
    const { error: joinError } = await supabase.rpc("join_workspace", {
      p_invite_code: inviteCode,
    });
    setPending(false);
    if (joinError) {
      setError(joinError);
      return;
    }
    router.push(`/w/${workspaceId}`);
  }

  return (
    <div>
      <Button onClick={handleJoin} disabled={pending}>
        {pending ? "Joining…" : "Join workspace"}
      </Button>
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
    </div>
  );
}
