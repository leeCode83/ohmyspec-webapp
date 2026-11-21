-- Spec §7 tests #3 (owner-only regenerate), #6 (owner removal protection),
-- and #8 (soft delete closes reads and joins).
begin;
\ir helpers.pgsql
select plan(8);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'member-b@test.dev', crypt('Str0ng!Pass', gen_salt('bf')));

insert into public.workspaces (id, name, owner_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ws A', '11111111-1111-1111-1111-111111111111');
insert into public.workspace_invites (workspace_id, code)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CODEAAAAAA1');
insert into public.workspace_members (workspace_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member');

-- Member calling regenerate raises 42501 Not authorized (spec §5).
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
select throws_ok(
  $$select regenerate_invite('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')$$,
  '42501',
  'Not authorized'
);

-- Owner regenerating changes the code.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
set local role authenticated;
select is(
  regenerate_invite('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') <> 'CODEAAAAAA1',
  true,
  'regenerate issues a new code'
);

-- remove_member: owner removes a member; targeting the owner raises.
select is(
  (select count(*) from public.workspace_members
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and user_id = '22222222-2222-2222-2222-222222222222'),
  1::bigint,
  'precondition: member present'
);
select remove_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222');
select is(
  (select count(*) from public.workspace_members
    where workspace_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and user_id = '22222222-2222-2222-2222-222222222222'),
  0::bigint,
  'owner removed the member row'
);
select throws_ok(
  $$select remove_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     '11111111-1111-1111-1111-111111111111')$$,
  'The owner cannot leave or remove themselves'
);

-- Soft delete: owner-only, one-way, closes reads and joins.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
set local role authenticated;
select throws_ok(
  $$select delete_workspace('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')$$,
  '42501',
  'Not authorized'
);
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
select delete_workspace('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
select is(
  (select count(*) from public.workspaces
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and deleted_at is null),
  0::bigint,
  'soft-deleted workspace invisible to owner reads'
);
select throws_ok(
  $$select join_workspace('CODEAAAAAA1')$$,
  'This invite link is invalid or the workspace was deleted'
);

select * from finish();
rollback;
