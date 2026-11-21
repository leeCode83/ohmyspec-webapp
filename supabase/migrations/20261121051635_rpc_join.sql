-- Join flow (spec §4). Order matters: validate the code first (the lock
-- needs the workspace id), then take a transaction-scoped advisory lock so
-- concurrent joins serialize BEFORE the count-based cap check (audit F5).

create or replace function public.join_workspace(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ws_id uuid;
  v_count int;
begin
  select w.id into v_ws_id
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  where i.code = p_invite_code and w.deleted_at is null;

  if v_ws_id is null then
    -- Identical generic message for unknown code and deleted workspace (spec §6).
    raise exception 'This invite link is invalid or the workspace was deleted';
  end if;

  -- Serialize concurrent joins per workspace so the cap cannot race.
  -- pg_advisory_xact_lock only has bigint and (int, int) overloads, so the
  -- uuid is mapped to its first 64 bits; a (theoretical) collision between
  -- distinct workspaces would merely serialize them, never break the cap.
  perform pg_advisory_xact_lock(
    ('x' || substr(replace(v_ws_id::text, '-', ''), 1, 16))::bit(64)::bigint
  );

  if exists (
    select 1 from public.workspace_members
    where workspace_id = v_ws_id and user_id = auth.uid()
  ) then
    raise exception 'You are already a member of this workspace';
  end if;

  select count(*) into v_count from public.workspace_members
  where workspace_id = v_ws_id;
  if v_count >= 10 then
    raise exception 'This workspace is full (10 members max)';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_ws_id, auth.uid(), 'member');

  return v_ws_id;
end;
$$;

revoke execute on function public.join_workspace(text) from public, anon;
grant execute on function public.join_workspace(text) to authenticated;
