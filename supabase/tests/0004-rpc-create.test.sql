-- Spec §7 test #10 (invite privacy + lookup_invite) and the atomic
-- create-as-owner path of spec §4.
begin;
\ir helpers.pgsql
select plan(9);

insert into auth.users (id, email, encrypted_password) values
  ('11111111-1111-1111-1111-111111111111', 'creator-a@test.dev', crypt('Str0ng!Pass', gen_salt('bf'))),
  ('22222222-2222-2222-2222-222222222222', 'joiner-b@test.dev',  crypt('Str0ng!Pass', gen_salt('bf')));

-- create_workspace builds workspace + invite + owner row in one call.
select tests.authenticate_as('11111111-1111-1111-1111-111111111111');
set local role authenticated;
select is(
  (select count(*) from public.workspaces where name = 'Ws A'),
  0::bigint,
  'precondition: no workspace yet'
);
select isnt(
  create_workspace('Ws A'),
  null::uuid,
  'create_workspace returns the new workspace id'
);
select is(
  (select count(*) from public.workspaces where name = 'Ws A'),
  1::bigint,
  'create_workspace inserts the workspace'
);
select is(
  (select count(*) from public.workspace_invites
    join public.workspaces w on w.id = workspace_id where w.name = 'Ws A'),
  1::bigint,
  'create_workspace inserts the invite row'
);
select is(
  (select count(*) from public.workspace_members where role = 'owner' and workspace_id =
     (select id from public.workspaces where name = 'Ws A')),
  1::bigint,
  'create_workspace inserts the owner membership'
);
select is(
  (select length(code) from public.workspace_invites where workspace_id =
     (select id from public.workspaces where name = 'Ws A')),
  12,
  'invite code is 12 characters'
);

-- Capture the live code while the owner can still see it (RLS-permitted read).
select i.code as live_code
from public.workspace_invites i
join public.workspaces w on w.id = i.workspace_id
where w.name = 'Ws A' \gset

-- A second workspace, created then soft-deleted, for the invalid states.
select tests.authenticate_as('22222222-2222-2222-2222-222222222222');
select create_workspace('Ws Dying');
-- Superuser performs the soft delete: an owner-side UPDATE is closed by RLS
-- (column-level grant semantics apply SELECT policies to the new row).
reset role;
update public.workspaces set deleted_at = now() where name = 'Ws Dying';

-- Capture the dying code as superuser (the soft-deleted row is invisible to B).
select i.code as dying_code
from public.workspace_invites i
join public.workspaces w on w.id = i.workspace_id
where w.name = 'Ws Dying' \gset

-- lookup_invite: anonymous gets id+name for a live code, null otherwise.
select tests.sign_out();
set local role anon;
select is(
  (select count(*) from lookup_invite(:'live_code')),
  1::bigint,
  'lookup_invite resolves a live code anonymously'
);
select is(
  (select count(*) from lookup_invite('NOSUCHCODE001')),
  0::bigint,
  'lookup_invite returns nothing for an unknown code'
);
select is(
  (select count(*) from lookup_invite(:'dying_code')),
  0::bigint,
  'lookup_invite hides soft-deleted workspaces'
);

select * from finish();
rollback;
