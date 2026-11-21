-- Owner-only operations (spec §4). Every function re-checks ownership
-- inside the security-definer body with the exact 'Not authorized' /
-- 42501 pair from the spec §5 error table; old invite links die the
-- moment regenerate commits; delete is a one-way soft delete.

create or replace function public.regenerate_invite(ws uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  if not exists (
    select 1 from public.workspaces
    where id = ws and owner_id = auth.uid() and deleted_at is null
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  update public.workspace_invites
  set code = public.generate_invite_code()
  where workspace_id = ws
  returning code into v_code;

  return v_code;
end;
$$;

create or replace function public.remove_member(ws uuid, user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.workspaces
    where id = ws and owner_id = auth.uid() and deleted_at is null
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.workspace_members
    where workspace_id = ws and workspace_members.user_id = remove_member.user_id and role = 'owner'
  ) then
    raise exception 'The owner cannot leave or remove themselves';
  end if;

  delete from public.workspace_members
  where workspace_id = ws and workspace_members.user_id = remove_member.user_id;
end;
$$;

create or replace function public.delete_workspace(ws uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.workspaces
    where id = ws and owner_id = auth.uid() and deleted_at is null
  ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  -- Soft delete (spec §2): one-way, no restore UI in MVP.
  update public.workspaces set deleted_at = now() where id = ws;
end;
$$;

revoke execute on function public.regenerate_invite(uuid) from public, anon;
revoke execute on function public.remove_member(uuid, uuid) from public, anon;
revoke execute on function public.delete_workspace(uuid) from public, anon;
grant execute on function public.regenerate_invite(uuid) to authenticated;
grant execute on function public.remove_member(uuid, uuid) to authenticated;
grant execute on function public.delete_workspace(uuid) to authenticated;

-- Hygiene (spec §6.2): the invite-code generator is an internal helper;
-- clients never need to call it directly.
revoke execute on function public.generate_invite_code() from public;
