-- TEST-ONLY helpers (audit F3). These emulate a JWT-authenticated request
-- context. They must NEVER be copied into supabase/migrations/: a callable
-- claim-setter reachable by `authenticated` would forge auth.uid() and
-- bypass every RLS policy. pg_prove runs as superuser, so RLS checks in
-- test files must also `set local role authenticated/anon` explicitly.

create schema if not exists tests;
grant usage on schema tests to anon, authenticated;

-- Emulate the JWT claims for a signed-in user (drives auth.uid()).
create or replace function tests.authenticate_as(uid uuid)
returns void
language plpgsql
as $$
begin
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated')::text,
    true
  );
end;
$$;

-- Clear the claims (anonymous context).
create or replace function tests.sign_out()
returns void
language plpgsql
as $$
begin
  perform set_config('request.jwt.claims', '', true);
end;
$$;
