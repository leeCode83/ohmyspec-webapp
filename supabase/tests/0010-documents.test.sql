-- Document CRUD spec (2026-11-21) §2 + §8 group 1: table constraints.
-- The CHECK constraints are the contract, so assertions match SQLSTATE
-- 23514 only — raw check_violation messages are Postgres internals, not
-- API (same convention as 0009). Assertion order:
--   1-3  title '' / whitespace / 61 chars rejected
--   4    60-char title accepted
--   5-7  bogus type / source / file_type rejected
--   8-11 native-with-metadata and imported-missing-metadata rejected
--   12   imported-complete accepted
--   13-16 defaults (content_md, version, updated_by, timestamps)
--   17-26 RLS (spec §8 group 3): trash visibility, non-member denial,
--         soft-deleted-workspace invisibility, CRUD ok/denied pairs,
--         non-granted column denial
--   27-35 trigger (spec §8 group 2) + conditional autosave (group 5):
--         version/updated_by/updated_at bumps, no-bump cases, stale
--         version / wrong holder / trashed row save denials
begin;
\ir helpers.pgsql
select plan(40);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'member-b@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('33333333-3333-3333-3333-333333333333', 'stranger-c@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member');

-- Ws C: soft-deleted workspace with a stranded document — its former
-- member must see nothing of it (is_active_member requires a live ws).
insert into public.workspaces (id, name, owner_id)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ws C', '33333333-3333-3333-3333-333333333333');
insert into public.workspace_members (workspace_id, user_id, role)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'owner');
insert into public.documents (workspace_id, title, type, source)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Buried doc', 'spec', 'native');
update public.workspaces set deleted_at = now()
where id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- ── Grup 1: Constraints ─────────────────────────────────────────────

-- 1-3: title guard — empty, whitespace-only, 61 chars all violate
-- documents_title_valid.
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '', 'spec', 'native')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '   ', 'spec', 'native')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', repeat('x', 61), 'spec', 'native')$$,
  '23514'
);

-- 4: 60-char title inserts fine (upper boundary).
insert into public.documents (id, workspace_id, title, type, source)
values ('c0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        repeat('x', 60), 'spec', 'native');
select is(
  (select count(*) from public.documents
    where id = 'c0000000-0000-0000-0000-000000000001'),
  1::bigint,
  '60-char title accepted'
);

-- 5-7: enum guards — bogus values violate their CHECK constraints.
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'memo', 'native')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'spec', 'cloned')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source, file_type, storage_path)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'spec', 'imported', 'rtf', 'ws/a.rtf')$$,
  '23514'
);

-- 8-11: shape consistency — native rows carry no file metadata;
-- imported rows carry both file_type and storage_path.
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source, file_type)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'spec', 'native', 'md')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source, storage_path)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'spec', 'native', 'ws/a.md')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source, file_type, storage_path)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'spec', 'imported', null, 'ws/a.md')$$,
  '23514'
);
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source, file_type, storage_path)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Doc', 'spec', 'imported', 'docx', null)$$,
  '23514'
);

-- 12: imported-complete shape is accepted.
insert into public.documents (id, workspace_id, title, type, source, file_type, storage_path)
values ('c0000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Imported', 'urs', 'imported', 'docx', 'ws/a.docx');
select is(
  (select count(*) from public.documents
    where id = 'c0000000-0000-0000-0000-000000000002'),
  1::bigint,
  'imported row with file metadata accepted'
);

-- 13-16: defaults — content_md starts empty, version starts at 1,
-- updated_by defaults to the inserting member (creator); requires the
-- authenticated role so auth.uid() resolves.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
set local role authenticated;
insert into public.documents (workspace_id, title, type, source)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Default doc', 'spec', 'native');
select is(
  (select content_md from public.documents where title = 'Default doc'),
  '',
  'content_md defaults to empty'
);
select is(
  (select version from public.documents where title = 'Default doc'),
  1,
  'version defaults to 1'
);
select is(
  (select updated_by from public.documents where title = 'Default doc'),
  '11111111-1111-1111-1111-111111111111'::uuid,
  'updated_by defaults to creator'
);
select ok(
  (select created_at is not null and updated_at is not null
    from public.documents where title = 'Default doc'),
  'timestamps set on insert'
);

-- ── Grup 3: RLS ─────────────────────────────────────────────────────

reset role;

-- 17: member sees own-workspace docs INCLUDING soft-deleted (trash
-- visibility — no deleted_at filter in the policy).
insert into public.documents (id, workspace_id, title, type, source)
values ('c0000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Trashed', 'plan', 'native');
update public.documents set deleted_at = now()
where id = 'c0000000-0000-0000-0000-000000000003';
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
set local role authenticated;
select is(
  (select count(*) from public.documents
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  4::bigint,
  'member sees own-workspace docs including soft-deleted'
);

-- 18: non-member sees nothing of Ws A.
select tests.authenticate_as('33333333-3333-3333-3333-333333333333');
select is(
  (select count(*) from public.documents
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0::bigint,
  'non-member sees nothing'
);

-- 19: former member of a soft-deleted workspace sees nothing —
-- is_active_member requires the workspace to be alive.
select is(
  (select count(*) from public.documents
    where workspace_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  0::bigint,
  'former member of soft-deleted workspace sees nothing'
);

-- 20: member insert ok (granted columns only — id is server-generated,
-- so the row is found by its unique title).
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
insert into public.documents (workspace_id, title, type, source)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Inserted by B', 'tasks', 'native');
select is(
  (select count(*) from public.documents where title = 'Inserted by B'),
  1::bigint,
  'member insert ok'
);

-- 21: non-member insert denied — RLS WITH CHECK fails as 42501.
select tests.authenticate_as('33333333-3333-3333-3333-333333333333');
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sneaky', 'spec', 'native')$$,
  '42501'
);

-- 22: insert naming a non-granted column (updated_by) denied even for a
-- member — column grants are the trust boundary, clients cannot forge
-- server-owned columns.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
select throws_ok(
  $$insert into public.documents (workspace_id, title, type, source, updated_by)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Forge', 'spec', 'native',
            '22222222-2222-2222-2222-222222222222')$$,
  '42501'
);

-- 23: member update ok.
update public.documents set title = 'Renamed by B'
where title = 'Inserted by B';
select is(
  (select title from public.documents
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and type = 'tasks'),
  'Renamed by B',
  'member update ok'
);

-- 24: non-member update matches 0 rows — silently ignored, no error.
-- The state check re-authenticates as a member: C cannot see the row at
-- all, so C's own view proves nothing about the row's content.
select tests.authenticate_as('33333333-3333-3333-3333-333333333333');
update public.documents set title = 'hijacked'
where title = 'Renamed by B';
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
select is(
  (select title from public.documents
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and type = 'tasks'),
  'Renamed by B',
  'non-member update silently ignored'
);

-- 25: member delete ok.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
delete from public.documents
where title = 'Renamed by B';
select is(
  (select count(*) from public.documents where title = 'Renamed by B'),
  0::bigint,
  'member delete ok'
);

-- 26: non-member delete matches 0 rows — the row survives (state
-- checked as a member, same reason as assertion 24).
select tests.authenticate_as('33333333-3333-3333-3333-333333333333');
delete from public.documents
where id = 'c0000000-0000-0000-0000-000000000002';
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
select is(
  (select count(*) from public.documents
    where id = 'c0000000-0000-0000-0000-000000000002'),
  1::bigint,
  'non-member delete silently ignored'
);

-- ── Grup 2: Trigger ─────────────────────────────────────────────────

-- 'Touch me': updated_at backdated to a constant so every bump is
-- detectable. Backdating is a superuser statement naming only updated_at
-- — not an OF column of the trigger, so it cannot fire it itself.
reset role;
insert into public.documents (id, workspace_id, title, type, source, content_md)
values ('c0000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Touch me', 'spec', 'native', 'v1');
update public.documents set updated_at = '2000-01-01 00:00:00+00'::timestamptz
where title = 'Touch me';

-- 27a-27c: content change bumps version, updated_by, updated_at.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
update public.documents set content_md = 'v2' where title = 'Touch me';
select is(
  (select version from public.documents where title = 'Touch me'),
  2,
  'content change bumps version'
);
select is(
  (select updated_by from public.documents where title = 'Touch me'),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'content change sets updated_by'
);
select ok(
  (select updated_at > '2000-01-01 00:00:00+00'::timestamptz
    from public.documents where title = 'Touch me'),
  'content change bumps updated_at'
);

-- 28a-28b: title-only rename bumps updated_at, never version.
reset role;
update public.documents set updated_at = '2000-01-01 00:00:00+00'::timestamptz
where title = 'Touch me';
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
update public.documents set title = 'Renamed' where title = 'Touch me';
select is(
  (select version from public.documents where title = 'Renamed'),
  2,
  'rename does not bump version'
);
select ok(
  (select updated_at > '2000-01-01 00:00:00+00'::timestamptz
    from public.documents where title = 'Renamed'),
  'rename bumps updated_at'
);

-- 29a-29b: heartbeat-style locked_at update bumps neither.
reset role;
update public.documents set updated_at = '2000-01-01 00:00:00+00'::timestamptz
where title = 'Renamed';
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
update public.documents set locked_at = now() where title = 'Renamed';
select ok(
  (select updated_at = '2000-01-01 00:00:00+00'::timestamptz
    from public.documents where title = 'Renamed'),
  'heartbeat does not bump updated_at'
);
select is(
  (select version from public.documents where title = 'Renamed'),
  2,
  'heartbeat does not bump version'
);

-- 30a-30b: soft delete bumps updated_at, not version.
reset role;
update public.documents set updated_at = '2000-01-01 00:00:00+00'::timestamptz
where title = 'Renamed';
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
update public.documents set deleted_at = now() where title = 'Renamed';
select is(
  (select version from public.documents where title = 'Renamed'),
  2,
  'soft delete does not bump version'
);
select ok(
  (select updated_at > '2000-01-01 00:00:00+00'::timestamptz
    from public.documents where title = 'Renamed'),
  'soft delete bumps updated_at'
);

-- ── Grup 5: Conditional autosave (SQL level) ────────────────────────

-- 'Save me': lock held by B, version 1. The autosave filter mirrors the
-- client contract (spec §6): .eq version, .eq locked_by, .is deleted_at.
reset role;
insert into public.documents (id, workspace_id, title, type, source, content_md)
values ('c0000000-0000-0000-0000-000000000006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Save me', 'plan', 'native', 'draft');
update public.documents
set locked_by = '22222222-2222-2222-2222-222222222222'::uuid, locked_at = now()
where title = 'Save me';

-- 31a-31b: matching version + lock holder saves; trigger bumps version.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
update public.documents
set content_md = 'saved'
where title = 'Save me'
  and version = 1
  and locked_by = auth.uid()
  and deleted_at is null;
select is(
  (select content_md from public.documents where title = 'Save me'),
  'saved',
  'autosave with matching version and lock saves'
);
select is(
  (select version from public.documents where title = 'Save me'),
  2,
  'autosave bumps version'
);

-- 32: stale version matches 0 rows — row unchanged.
update public.documents
set content_md = 'stale'
where title = 'Save me'
  and version = 1
  and locked_by = auth.uid()
  and deleted_at is null;
select is(
  (select content_md from public.documents where title = 'Save me'),
  'saved',
  'stale version autosave matches 0 rows'
);

-- 33: wrong lock holder (owner A is a member, but not the lock holder)
-- matches 0 rows.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
update public.documents
set content_md = 'hijack'
where title = 'Save me'
  and version = 2
  and locked_by = auth.uid()
  and deleted_at is null;
select is(
  (select content_md from public.documents where title = 'Save me'),
  'saved',
  'wrong lock holder autosave matches 0 rows'
);

-- 34: autosave against a soft-deleted document matches 0 rows — no
-- writing into a trashed row (soft delete is allowed while locked; the
-- holder's next save/heartbeat filters deleted_at).
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
update public.documents set deleted_at = now() where title = 'Save me';
update public.documents
set content_md = 'write into trash'
where title = 'Save me'
  and version = 2
  and locked_by = auth.uid()
  and deleted_at is null;
select is(
  (select content_md from public.documents where title = 'Save me'),
  'saved',
  'autosave against soft-deleted document matches 0 rows'
);

select * from finish();
rollback;
