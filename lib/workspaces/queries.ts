import { createClient } from "@/lib/supabase/server";

/** A workspace as listed on the dashboard. */
export interface WorkspaceSummary {
  id: string;
  name: string;
  role: "owner" | "member";
}

/**
 * Lists the caller's live workspaces with their role (spec §2.6).
 *
 * Reads through the cookies-based server client, so every row is already
 * RLS-scoped to the caller; soft-deleted workspaces are filtered out via
 * the inner join. Explicit columns only — never `select *` (audit F1).
 *
 * @returns Workspaces ordered by join time; empty when the caller has none.
 */
export async function getMyWorkspaces(): Promise<WorkspaceSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return []; // proxy.ts normally prevents this; defensive

  const { data, error } = await supabase
    .from("workspace_members")
    .select("role, workspaces!inner(id, name)")
    .filter("workspaces.deleted_at", "is", null)
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    // supabase-js' untyped inference models the embedded resource as an
    // array, but PostgREST returns workspace_members' many-to-one link to
    // workspaces as a single object; normalize both to that wire format.
    const workspace = Array.isArray(row.workspaces)
      ? row.workspaces[0]
      : row.workspaces;
    return {
      id: workspace.id,
      name: workspace.name,
      role: row.role as "owner" | "member",
    };
  });
}
