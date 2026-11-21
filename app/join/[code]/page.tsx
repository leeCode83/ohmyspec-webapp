import Link from "next/link";
import { JoinButton } from "@/components/join/join-button";
import { createClient } from "@/lib/supabase/server";

export const instant = false; // blocking route: resolves invite code + auth cookies per request

/**
 * Invite landing page (spec §2.5) — the only route that passes through for
 * anonymous AND authenticated users. Resolves the code via the read-only
 * lookup_invite RPC; there is no direct SELECT path into workspaces or
 * workspace_invites for non-members. Unknown and soft-deleted codes render
 * the identical generic invalid state (no signal difference, spec §6).
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: invites } = await supabase.rpc("lookup_invite", {
    p_invite_code: code,
  });
  const invite = invites?.[0] ?? null;

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-center text-muted-foreground">
          This invite link is invalid or the workspace was deleted.
        </p>
      </main>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const nextPath = `/join/${code}`;

  if (!user) {
    // Anonymous: show the workspace name + auth links carrying next.
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">{invite.name}</h1>
          <p className="mt-2 text-muted-foreground">
            You have been invited to join this workspace.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              className="underline"
              href={{ pathname: "/auth/login", query: { next: nextPath } }}
            >
              Log in to join
            </Link>
            <Link
              className="underline"
              href={{ pathname: "/auth/signup", query: { next: nextPath } }}
            >
              Sign up to join
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated: member already? RLS makes the row visible only if so.
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", invite.id)
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold">{invite.name}</h1>
        {membership ? (
          <>
            <p className="mt-2 text-muted-foreground">You are already a member.</p>
            <Link className="mt-4 inline-block underline" href={`/w/${invite.id}`}>
              Go to workspace
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-muted-foreground">
              You have been invited to join this workspace.
            </p>
            <div className="mt-6 flex justify-center">
              <JoinButton workspaceId={invite.id} inviteCode={code} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
