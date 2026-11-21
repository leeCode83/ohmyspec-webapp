-- Spec §7 tests #4 (cap 10) and #7 (join flow: wrong code / deleted ws /
-- valid join / duplicate join).
begin;
\ir helpers.pgsql
select plan(5);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_invites (workspace_id, code)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CODEAAAAAA1');
insert into public.workspace_members (workspace_id, user_id, role)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner');

-- Fill the workspace to the cap (9 more members → 10 total).
insert into auth.users (id, email, encrypted_password)
select ('99999999-0000-0000-0000-' || lpad(g::text, 12, '0'))::uuid,
       'filler' || g || '@test.dev',
       crypt('Str0ng!Pass', gen_salt('bf'))
from generate_series(1, 9) g;
insert into public.workspace_members (workspace_id, user_id, role)
select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
       ('99999999-0000-0000-0000-' || lpad(g::text, 12, '0'))::uuid,
       'member'
from generate_series(1, 9) g;

-- The 11th joiner hits the cap.
insert into auth.users (id, email, encrypted_password)
values ('88888888-8888-8888-8888-888888888888', 'late@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));
select tests.authenticate_as('88888888-8888-8888-8888-888888888888');
set local role authenticated;
select throws_ok(
  $$select join_workspace('CODEAAAAAA1')$$,
  'This workspace is full (10 members max)'
);

select tests.sign_out();
reset role;
-- soft-delete a second workspace for the generic-error assertions (seeded as superuser)
insert into public.workspaces (id, name, owner_id)
values ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ws Dying', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_invites (workspace_id, code)
values ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'CODEDYING01');
insert into public.workspace_members (workspace_id, user_id, role)
values ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'owner');
update public.workspaces set deleted_at = now() where id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

-- Wrong code and soft-deleted workspace produce the same generic message.
select tests.authenticate_as('88888888-8888-8888-8888-888888888888');
set local role authenticated;
select throws_ok(
  $$select join_workspace('WRONGCODE999')$$,
  'This invite link is invalid or the workspace was deleted'
);
select throws_ok(
  $$select join_workspace('CODEDYING01')$$,
  'This invite link is invalid or the workspace was deleted'
);

reset role;
-- Happy path: a fresh user joins a live workspace as a plain member.
-- (Seeds run as superuser: no INSERT policies exist — inserts happen via RPCs.)
insert into auth.users (id, email, encrypted_password)
values ('77777777-7777-7777-7777-777777777777', 'joiner@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));
-- Ws A is at cap, so open a fresh workspace for the happy path.
insert into public.workspaces (id, name, owner_id)
values ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ws Open', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_invites (workspace_id, code)
values ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'CODEOPEN0001');
insert into public.workspace_members (workspace_id, user_id, role)
values ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'owner');

select tests.authenticate_as('77777777-7777-7777-7777-777777777777');
set local role authenticated;
select is(
  join_workspace('CODEOPEN0001'),
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
  'valid code joins and returns the workspace id'
);
select throws_ok(
  $$select join_workspace('CODEOPEN0001')$$,
  'You are already a member of this workspace'
);

select * from finish();
rollback;
