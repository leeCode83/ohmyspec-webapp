-- Spec §7 test #5: exactly one owner per workspace; the owner cannot be
-- demoted. (Owner removal is protected by RLS policies, Task 4.)
begin;
\ir helpers.pgsql
select plan(4);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'user-b@test.dev',  crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111');

insert into public.workspace_members (workspace_id, user_id, role)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner');

insert into public.workspace_members (workspace_id, user_id, role)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member');

select throws_ok(
  $$insert into public.workspace_members (workspace_id, user_id, role)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'owner')$$,
  'A workspace can only have one owner'
);

select throws_ok(
  $$update public.workspace_members set role = 'member'
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and user_id = '11111111-1111-1111-1111-111111111111'$$,
  'The owner role cannot be demoted'
);

select throws_ok(
  $$update public.workspace_members set role = 'owner'
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and user_id = '22222222-2222-2222-2222-222222222222'$$,
  'A workspace can only have one owner'
);

select is(
  (select count(*) from public.workspace_members where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  2::bigint,
  'rejected writes leave the membership untouched'
);

select * from finish();
rollback;
