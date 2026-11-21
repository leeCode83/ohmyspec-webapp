-- Core M1 tables (spec §2). The invite code lives in its own table so that
-- member-readable columns can never include it (audit F1). Workspace delete
-- is a soft delete: deleted_at IS NOT NULL means nonexistent everywhere.

create table public.workspaces (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.workspace_invites (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  code         text not null unique
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('owner','member')),
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

-- Invariant 1 (spec §2): a workspace gains a second owner never, and its
-- existing owner is never demoted. Owner-row deletion is NOT handled here —
-- a delete trigger would also fire on FK cascades and break auth-user /
-- workspace cascade deletion; RLS policies + remove_member enforce it.
create or replace function public.enforce_workspace_owner_invariant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.role = 'owner' then
    if exists (
      select 1 from public.workspace_members
      where workspace_id = new.workspace_id and role = 'owner'
    ) then
      raise exception 'A workspace can only have one owner';
    end if;
  end if;

  if tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner' then
    raise exception 'The owner role cannot be demoted';
  end if;

  return new;
end;
$$;

create trigger enforce_workspace_owner_invariant
  before insert or update of role on public.workspace_members
  for each row execute function public.enforce_workspace_owner_invariant();
