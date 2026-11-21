-- Storage policy guards (spec §4 Storage / audit F2): exact second path
-- segment anchoring, '..' rejection, soft-delete closure, is_member gate.
begin;
\ir helpers.pgsql
select plan(6);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'member-b@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ws Dead', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'owner');
update public.workspaces set deleted_at = now() where id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;

-- Member B may write under their own workspace segment.
insert into storage.objects (bucket_id, name)
values ('imports', 'imports/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/doc-1/file.md');
select is(
  (select count(*) from storage.objects
    where name = 'imports/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/doc-1/file.md'),
  1::bigint,
  'member can insert under their own workspace segment'
);

-- Foreign workspace segment is rejected.
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('imports', 'imports/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/doc-1/file.md')$$,
  '42501',
  'new row violates row-level security policy for table "objects"'
);

-- '..' in the path is rejected outright.
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('imports', 'imports/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/../file.md')$$,
  '42501',
  'new row violates row-level security policy for table "objects"'
);

-- Soft-deleted workspace storage is closed.
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('imports', 'imports/dddddddd-dddd-dddd-dddd-dddddddddddd/doc-1/file.md')$$,
  '42501',
  'new row violates row-level security policy for table "objects"'
);

-- Owner-side probe isolating the liveness clause: A IS a member of the dead
-- workspace, so the rejection above cannot be attributed to the membership
-- gate — only workspace liveness can fail here.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('imports', 'imports/dddddddd-dddd-dddd-dddd-dddddddddddd/doc-1/owner.md')$$,
  '42501',
  'new row violates row-level security policy for table "objects"'
);

-- Paths outside the imports bucket layout are rejected.
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('imports', 'other-bucket/file.md')$$,
  '42501',
  'new row violates row-level security policy for table "objects"'
);

select * from finish();
rollback;
