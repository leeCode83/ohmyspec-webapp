"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createBrowserClient } from "@/lib/supabase/browser";
import { shouldShowTechnicalDetails, toUserMessage } from "@/lib/auth/errors";

/**
 * Inline error line for RPC/row failures: whitelisted message as-is,
 * otherwise the generic fallback — the raw error stays in the console for
 * debugging (devtools) while the details block pattern is available via
 * the shared helper if rendered.
 */
function InlineError({ error }: { error: { message: string } | null }) {
  if (!error) return null;
  return (
    <p className="text-sm text-red-600" role="alert">
      {toUserMessage(error)}
    </p>
  );
}

/** Raw-error details block shown under the generic fallback (audit F6). */
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
 * Owner action: remove a member (spec §2.7). Confirms first; the owner row
 * shows no such control (backend trigger rejects anyway).
 */
export function RemoveMemberButton({
  workspaceId,
  userId,
  memberName,
}: {
  workspaceId: string;
  userId: string;
  memberName: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<{ message: string } | null>(null);

  return (
    <div className="flex flex-col items-end">
      <ConfirmDialog
        trigger={<Button variant="outline" size="sm">Remove</Button>}
        title={`Remove ${memberName || "this member"}?`}
        description={`${memberName || "This member"} will lose access to this workspace. Their chat history is removed; documents they authored remain.`}
        confirmLabel="Remove member"
        destructive
        onConfirm={async () => {
          setError(null);
          const supabase = createBrowserClient();
          const { error: rpcError } = await supabase.rpc("remove_member", {
            ws: workspaceId,
            user_id: userId,
          });
          if (rpcError) {
            setError(rpcError);
            return rpcError.message;
          }
          router.refresh();
          return null;
        }}
      />
      <InlineError error={error} />
      <TechnicalDetails error={error} />
    </div>
  );
}

/**
 * Member action: leave the workspace (spec §2.7) by deleting the caller's
 * own workspace_members row (RLS: non-owner rows only). On success the
 * user lands back on the dashboard.
 */
export function LeaveWorkspaceButton({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [error, setError] = useState<{ message: string } | null>(null);

  return (
    <div className="flex flex-col items-end">
      <ConfirmDialog
        trigger={<Button variant="outline" size="sm">Leave workspace</Button>}
        title="Leave this workspace?"
        description="You will lose access until re-invited with a valid invite link."
        confirmLabel="Leave"
        destructive
        onConfirm={async () => {
          setError(null);
          const supabase = createBrowserClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return "Signed out";
          const { error: deleteError } = await supabase
            .from("workspace_members")
            .delete()
            .eq("workspace_id", workspaceId)
            .eq("user_id", user.id);
          if (deleteError) {
            setError(deleteError);
            return deleteError.message;
          }
          router.push("/");
          return null;
        }}
      />
      <InlineError error={error} />
      <TechnicalDetails error={error} />
    </div>
  );
}
