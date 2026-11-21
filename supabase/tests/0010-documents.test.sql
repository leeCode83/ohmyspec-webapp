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
begin;
\ir helpers.pgsql
select plan(16);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'member-b@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member');

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

select * from finish();
rollback;
