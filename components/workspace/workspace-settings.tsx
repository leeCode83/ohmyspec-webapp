"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createBrowserClient } from "@/lib/supabase/browser";
import { shouldShowTechnicalDetails, toUserMessage } from "@/lib/auth/errors";

/** Shared inline error rendering for the settings actions (audit F6). */
function InlineError({ error }: { error: { message: string } | null }) {
  if (!error) return null;
  return (
    <div role="alert">
      <p className="text-sm text-red-600">{toUserMessage(error)}</p>
      {shouldShowTechnicalDetails(error) && (
        <details className="mt-1 text-xs font-mono text-muted-foreground">
          <summary>Technical details</summary>
          {error.message}
        </details>
      )}
    </div>
  );
}

/**
 * Owner inline rename (spec §2.7 header): plain UPDATE on workspaces.name —
 * RLS restricts the write to the owner (column grant: name, deleted_at).
 */
export function RenameWorkspaceForm({
  workspaceId,
  initialName,
}: {
  workspaceId: string;
  initialName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createBrowserClient();
    const { error: updateError } = await supabase
      .from("workspaces")
      .update({ name: name.trim() })
      .eq("id", workspaceId);
    setPending(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleRename} className="flex items-center gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} aria-label="Workspace name" required />
        <Button type="submit" variant="outline" disabled={pending || name.trim() === initialName}>
          {pending ? "Saving…" : "Rename"}
        </Button>
      </form>
      <InlineError error={error} />
    </div>
  );
}

/**
 * Owner danger zone (spec §2.7): one-way soft delete. The dialog states
 * that all data becomes inaccessible; after the RPC the workspace
 * disappears from all lists and the owner is routed to the dashboard
 * (which bounces them to onboarding if it was their last workspace).
 */
export function DeleteWorkspaceZone({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [error, setError] = useState<{ message: string } | null>(null);

  return (
    <div className="space-y-2">
      <ConfirmDialog
        trigger={<Button variant="destructive">Delete workspace</Button>}
        title="Delete this workspace?"
        description="All data in this workspace becomes inaccessible to everyone — including you. This cannot be undone."
        confirmLabel="Delete forever"
        destructive
        onConfirm={async () => {
          setError(null);
          const supabase = createBrowserClient();
          const { error: rpcError } = await supabase.rpc("delete_workspace", {
            ws: workspaceId,
          });
          if (rpcError) {
            setError(rpcError);
            return rpcError.message;
          }
          router.push("/");
          return null;
        }}
      />
      <InlineError error={error} />
    </div>
  );
}
