"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase/browser";
import { shouldShowTechnicalDetails, toUserMessage } from "@/lib/auth/errors";

/**
 * "Create workspace" entry point on the dashboard (spec §2.6): button →
 * dialog with a name input → create_workspace RPC → the new card appears
 * via router.refresh().
 */
export function CreateWorkspaceDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<{ message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createBrowserClient();
    const { error: rpcError } = await supabase.rpc("create_workspace", {
      p_name: name,
    });
    setPending(false);
    if (rpcError) {
      setError(rpcError);
      return;
    }
    setOpen(false);
    setName("");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create workspace</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-workspace-name">Workspace name</Label>
            <Input
              id="new-workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && (
            <div role="alert">
              <p className="text-sm text-red-600">{toUserMessage(error)}</p>
              {shouldShowTechnicalDetails(error) && (
                <details className="mt-1 text-xs font-mono text-muted-foreground">
                  <summary>Technical details</summary>
                  {error.message}
                </details>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
