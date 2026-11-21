-- Workspace CRUD spec (2026-11-21) §4: name guard tests. The CHECK
-- constraint is the contract, so assertions match SQLSTATE 23514 only —
-- the raw check_violation message is Postgres internals, not API.
-- Spec #3 (60-char succeeds) and #4 (valid rename updates the row) share
-- one assertion: the successful 60-char rename IS a valid rename.
begin;
\ir helpers.pgsql
select plan(6);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'member-b@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member');

-- Spec #1: empty name rejected.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
set local role authenticated;
select throws_ok(
  $$update public.workspaces set name = ''
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23514'
);

-- Spec #2: whitespace-only name rejected (btrim closes the hole).
select throws_ok(
  $$update public.workspaces set name = '   '
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23514'
);

-- Spec #3a: 61 characters rejected.
select throws_ok(
  $$update public.workspaces set name = repeat('x', 61)
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23514'
);

-- Spec #3b + #4: 60-character rename succeeds and updates the row.
update public.workspaces set name = repeat('x', 60)
where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select is(
  (select name from public.workspaces
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  repeat('x', 60),
  '60-char rename succeeds and updates the row'
);

-- Spec #5: member (non-owner) rename matches 0 rows via RLS — no error,
-- name unchanged.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
update public.workspaces set name = 'hijacked'
where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select is(
  (select name from public.workspaces
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  repeat('x', 60),
  'member rename is silently ignored by RLS'
);

-- Spec #6: the constraint also covers INSERT through create_workspace.
select throws_ok(
  $$select create_workspace(repeat('y', 61))$$,
  '23514'
);

select * from finish();
rollback;
