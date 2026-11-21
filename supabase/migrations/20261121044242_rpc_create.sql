-- Creation-side security-definer RPCs (spec §4). create_workspace is atomic
-- so the RLS chicken-and-egg (a user cannot satisfy "is member" before the
-- first row exists) never surfaces to the client.

-- 12-char base62 code (spec §2). random() is fine here: enumeration of the
-- 62^12 space is infeasible and codes are regenerated on demand.
create or replace function public.generate_invite_code()
returns text
language sql
volatile
as $$
  select string_agg(
    substr('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
           floor(random() * 62 + 1)::int, 1),
    ''
  )
  from generate_series(1, 12);
$$;

create or replace function public.create_workspace(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ws_id uuid;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Workspace name cannot be empty';
  end if;

  insert into public.workspaces (name, owner_id)
  values (trim(p_name), auth.uid())
  returning id into v_ws_id;

  insert into public.workspace_invites (workspace_id, code)
  values (v_ws_id, public.generate_invite_code());

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_ws_id, auth.uid(), 'owner');

  return v_ws_id;
end;
$$;

-- Read-only join landing lookup (spec §4): the ONLY anonymous path into
-- workspace names. No writes, no side effects, hides soft-deleted rows.
create or replace function public.lookup_invite(p_invite_code text)
returns table (id uuid, name text)
language sql
security definer
set search_path = public
stable
as $$
  select w.id, w.name
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  where i.code = p_invite_code and w.deleted_at is null
$$;

-- Executable surface (spec §4): revoke from public, grant per caller.
revoke execute on function public.create_workspace(text) from public, anon;
grant execute on function public.create_workspace(text) to authenticated;
revoke execute on function public.lookup_invite(text) from public;
grant execute on function public.lookup_invite(text) to anon, authenticated;
