import { notFound } from "next/navigation";
import { MemberList, type MemberRow } from "@/components/workspace/member-list";
import { InvitePanel } from "@/components/workspace/invite-panel";
import {
  LeaveWorkspaceButton,
  RemoveMemberButton,
} from "@/components/workspace/workspace-mutations";
import { createClient } from "@/lib/supabase/server";

/**
 * Workspace page, M1 shape (spec §2.7): header with name, members list,
 * the owner invite panel, mutation actions per role, and — mounted by a
 * later task — the danger zone. Every read is RLS-scoped; a workspace the
 * caller cannot see returns no row → 404. Explicit columns only (audit F1).
 */
export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!workspace) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = workspace.owner_id === user?.id;

  const { data: members } = await supabase
    .from("workspace_members")
    .select("user_id, role, profiles(name)")
    .eq("workspace_id", id)
    .order("joined_at", { ascending: true });

  const rows: MemberRow[] = (members ?? []).map((member) => {
    // supabase-js' untyped inference models the embed as an array, but
    // PostgREST returns profiles' many-to-one link as a single object.
    const profile = Array.isArray(member.profiles)
      ? member.profiles[0]
      : member.profiles;
    return {
      userId: member.user_id,
      name: profile?.name ?? "",
      role: member.role as "owner" | "member",
    };
  });

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="font-heading text-2xl font-bold">{workspace.name}</h1>
      </header>
      <MemberList
        members={rows}
        actions={
          isOwner
            ? (member) =>
                member.role !== "owner" ? (
                  <RemoveMemberButton
                    workspaceId={workspace.id}
                    userId={member.userId}
                    memberName={member.name}
                  />
                ) : undefined
            : undefined
        }
      />
      {!isOwner && <LeaveWorkspaceButton workspaceId={workspace.id} />}
      {isOwner && <InvitePanel workspaceId={workspace.id} />}
    </main>
  );
}
