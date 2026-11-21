-- Document CRUD spec (2026-11-21) — single migration for the whole
-- documents feature (spec §1): table, RLS, version-bump trigger, and the
-- one lock-acquire RPC. Sections are appended task by task.
--
-- §2 — Table. PRD §7.3 sketch plus four refinements: created_at/updated_at
-- (list sorts by recency, trash shows deletion age), ON DELETE SET NULL
-- for updated_by/locked_by (deleting an auth account must not cascade-
-- delete every document they edited; a null locked_by also frees a stale
-- lock), a native↔imported consistency CHECK (row shape enforced at the
-- table level), and defaults + a workspace_id index (every list/trash
-- query filters on it). type/source/file_type stay plain CHECKs — altering
-- an enum type is a migration headache; a CHECK is a one-line change.

create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title        text not null,
  type         text not null check (type in ('spec','urs','plan','tasks','diagram','blank')),
  source       text not null check (source in ('native','imported')),
  file_type    text check (file_type in ('md','docx','pdf')),
  storage_path text,
  content_md   text not null default '',
  updated_by   uuid default auth.uid() references auth.users(id) on delete set null,
  locked_by    uuid references auth.users(id) on delete set null,
  locked_at    timestamptz,
  deleted_at   timestamptz,
  version      integer not null default 1,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint documents_title_valid check (length(btrim(title)) between 1 and 60),
  constraint documents_source_consistent check (
    (source = 'native'   and file_type is null     and storage_path is null)
    or
    (source = 'imported' and file_type is not null and storage_path is not null)
  )
);

create index documents_workspace_id_idx on public.documents (workspace_id);

-- §3 — RLS + column grants. Enable + force (parity with all M1 tables).
-- No deleted_at filter in any policy: soft-deleted documents (trash) stay
-- readable so the trash view and restore share the same SELECT/UPDATE
-- paths; the default list filters deleted_at client-side. is_member (M1)
-- is left untouched — its callers keep their behavior — while the new
-- is_active_member additionally requires the workspace to be alive (PRD
-- §3: a soft-deleted workspace is invisible and un-joinable).

alter table public.documents enable row level security;
alter table public.documents force row level security;

create or replace function public.is_active_member(ws uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members m
    join public.workspaces w on w.id = m.workspace_id
    where m.workspace_id = ws
      and m.user_id = auth.uid()
      and w.deleted_at is null
  );
$$;

-- Helper hygiene (spec §6.2 convention): policy expressions run with the
-- querying user's rights, so revoking WITHOUT the grant would break
-- every authenticated read.
revoke execute on function public.is_active_member(uuid) from public;
grant execute on function public.is_active_member(uuid) to authenticated;

create policy "members read workspace documents" on public.documents
  for select to authenticated
  using (public.is_active_member(workspace_id));
create policy "members insert workspace documents" on public.documents
  for insert to authenticated
  with check (public.is_active_member(workspace_id));
create policy "members update workspace documents" on public.documents
  for update to authenticated
  using (public.is_active_member(workspace_id))
  with check (public.is_active_member(workspace_id));
create policy "members delete workspace documents" on public.documents
  for delete to authenticated
  using (public.is_active_member(workspace_id));

-- Column grants govern the SET clause only — filters (.eq('version', …))
-- need no grant. Clients cannot set id, updated_by, version, or
-- timestamps on any path: all server-generated (§4). These are exactly
-- the columns the five write paths SET (§6).
revoke insert on public.documents from authenticated;
grant insert (workspace_id, title, type, source, file_type, storage_path, content_md)
  on public.documents to authenticated;

revoke update on public.documents from authenticated;
grant update (title, content_md, locked_by, locked_at, deleted_at)
  on public.documents to authenticated;

-- §4 — Version-bump trigger. The server owns the "every content change
-- bumps the version" invariant; clients cannot bypass it. updated_at
-- bumps on any title/content_md/deleted_at write (rename touches it too);
-- version + updated_by bump ONLY when content_md actually changes.
-- Heartbeat (locked_at) and release (locked_by, locked_at) statements
-- name none of the OF columns, so lock traffic never churns updated_at.
-- Runs as invoker (not security definer) — it only stamps NEW values —
-- and raises nothing: no exception paths.
create or replace function public.documents_touch()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  if new.content_md is distinct from old.content_md then
    new.version := old.version + 1;
    new.updated_by := auth.uid();
  end if;
  return new;
end;
$$;

create trigger documents_touch
  before update of title, content_md, deleted_at on public.documents
  for each row execute function public.documents_touch();

-- §5 — Soft lock. The one RPC (decision 2): acquiring must atomically
-- test-and-set locked_by/locked_at, which plain RLS UPDATEs cannot do.
-- Security definer because eligibility is checked internally (a definer
-- bypasses RLS): document exists, is live, is editable (PRD §4.1 —
-- .docx/.pdf imports get no soft lock), and the caller is a member of a
-- live workspace. Any failure → NULL (decision 6: silent refusal — the
-- client shows the "X is editing" banner either way and cannot
-- distinguish). Three-branch acquire in one atomic UPDATE — free,
-- mine (refresh locked_at), or expired (> 2 minutes, PRD §7.5.7); a
-- competing acquirer's row lock serializes them, the loser sees 0 rows
-- and gets NULL. Heartbeat and release stay plain UPDATEs (§5.2) — the
-- client only writes locked_* for a document it holds.
create or replace function public.acquire_document_lock(p_doc uuid)
returns public.documents
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ws      uuid;
  v_current public.documents;
begin
  select workspace_id into v_ws
  from public.documents
  where id = p_doc
    and deleted_at is null
    and (source = 'native' or (source = 'imported' and file_type = 'md'));

  if v_ws is null or not public.is_active_member(v_ws) then
    return null;
  end if;

  update public.documents d
  set locked_by = auth.uid(), locked_at = now()
  where d.id = p_doc
    and (
      d.locked_by is null
      or d.locked_by = auth.uid()
      or d.locked_at < now() - interval '2 minutes'
    )
  returning * into v_current;

  return v_current;
end;
$$;

revoke execute on function public.acquire_document_lock(uuid) from public;
grant execute on function public.acquire_document_lock(uuid) to authenticated;
