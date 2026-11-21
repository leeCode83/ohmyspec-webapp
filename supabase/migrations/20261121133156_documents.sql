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
