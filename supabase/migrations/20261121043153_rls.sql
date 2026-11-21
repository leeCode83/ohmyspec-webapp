-- Row level security for all M1 tables (spec §3). Enable + force on every
-- table; no table has an INSERT policy — inserts happen only via
-- security-definer functions (Tasks 5-7) and the signup trigger.

alter table public.profiles         enable row level security;
alter table public.profiles         force row level security;
alter table public.workspaces       enable row level security;
alter table public.workspaces       force row level security;
alter table public.workspace_invites enable row level security;
alter table public.workspace_invites force row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_members force row level security;

-- Membership lookup as a security definer helper: avoids recursive RLS
-- evaluation on workspace_members. Every business-table policy in later
-- specs (documents, chunks, chats) calls this.
create or replace function public.is_member(ws uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws and user_id = auth.uid()
  );
$$;

-- profiles: own row only; delete denied by absence of a policy.
create policy "read own profile" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- workspaces: members read live rows; owner updates (rename / soft delete).
create policy "members read live workspace" on public.workspaces
  for select to authenticated
  using (deleted_at is null and public.is_member(id));
create policy "owner updates workspace" on public.workspaces
  for update to authenticated
  using (owner_id = auth.uid() and deleted_at is null)
  with check (owner_id = auth.uid());
-- Spec §3: owner UPDATE is restricted to the name and deleted_at columns.
revoke update on public.workspaces from authenticated;
grant update (name, deleted_at) on public.workspaces to authenticated;

-- workspace_invites: owner of a live workspace only (audit F1).
create policy "owner reads invite code" on public.workspace_invites
  for select to authenticated
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = workspace_id
        and w.owner_id = auth.uid()
        and w.deleted_at is null
    )
  );

-- workspace_members: members read co-members; owner row deletion is closed
-- by policy (invariant 2), which leaves FK cascades from auth.users intact.
create policy "members read co-members" on public.workspace_members
  for select to authenticated
  using (public.is_member(workspace_id));
create policy "non-owner member deletes own row" on public.workspace_members
  for delete to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.owner_id <> auth.uid()
    )
  );
create policy "owner removes members" on public.workspace_members
  for delete to authenticated
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.owner_id = auth.uid()
    )
    and user_id <> auth.uid()
  );
