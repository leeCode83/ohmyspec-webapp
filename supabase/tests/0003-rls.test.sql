-- Spec §7 tests #1 and #2: cross-workspace denial, non-member/anonymous
-- denial, plus the owner-row delete protection and invite privacy (F1).
begin;
\ir helpers.pgsql
select plan(8);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'owner-b@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('33333333-3333-3333-3333-333333333333', 'member-c@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ws B', '22222222-2222-2222-2222-222222222222');
insert into public.workspace_invites (workspace_id, code) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CODEAAAAAA1'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CODEBBBBBB2');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member');

-- Anonymous sees nothing.
select tests.sign_out();
set local role anon;
select is((select count(*) from public.workspaces), 0::bigint, 'anonymous cannot select workspaces');

-- User B (ws B only) sees nothing of ws A.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
select is(
  (select count(*) from public.workspaces where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0::bigint,
  'cross-workspace select is denied'
);
select is(
  (select count(*) from public.workspace_members where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0::bigint,
  'cross-workspace member rows are invisible'
);
select is(
  (select count(*) from public.workspace_invites where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0::bigint,
  'cross-workspace invite is invisible'
);

-- Member C of ws A can read the workspace but never the invite code (F1).
select tests.authenticate_as('33333333-3333-3333-3333-333333333333');
select is(
  (select count(*) from public.workspaces where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  1::bigint,
  'member can read their workspace'
);
select is(
  (select count(*) from public.workspace_invites where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0::bigint,
  'member can never read the invite code'
);

-- Owner-row delete protection via policy: owner A attempts to delete their
-- own membership row — no DELETE policy matches, so nothing is deleted.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
delete from public.workspace_members
  where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    and user_id = '11111111-1111-1111-1111-111111111111';
select is(
  (select count(*) from public.workspace_members
    where user_id = '11111111-1111-1111-1111-111111111111'),
  1::bigint,
  'owner self-delete attempt deletes nothing'
);

select tests.authenticate_as('33333333-3333-3333-3333-333333333333');
delete from public.workspace_members
  where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    and user_id = '33333333-3333-3333-3333-333333333333';
select is(
  (select count(*) from public.workspace_members
    where user_id = '33333333-3333-3333-3333-333333333333'),
  0::bigint,
  'non-owner member can delete their own row'
);

select * from finish();
rollback;
