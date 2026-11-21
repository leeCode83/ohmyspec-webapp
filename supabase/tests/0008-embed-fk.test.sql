-- The profiles embed FK exists (PostgREST resolves profiles(name) via it).
-- Signature notes (pgTAP 1.3.3 as installed in the local stack):
-- 1. has_table(regclass, text) does not exist, so the schema-qualified
--    has_table('public','profiles', text) form is used.
-- 2. fk_ok was substituted per the ruled fallback: workspace_members.user_id
--    legitimately carries TWO foreign keys (auth.users — Supabase auth — and
--    profiles — PostgREST embed hint), and every fk_ok overload
--    (5-arg name,name,name,name,text and 7-arg schema-qualified) looks up
--    pg_all_foreign_keys by (schema,) table and columns only, picking one
--    match arbitrarily, so it cannot assert WHICH table the FK references.
--    The direct pg_constraint catalog count keeps the assertion semantics:
--    exactly one FK from workspace_members references profiles.
begin;
\ir helpers.pgsql
select plan(2);

select has_table('public', 'profiles', 'profiles table exists');
select is(
  (select count(*) from pg_constraint
   where conrelid = 'public.workspace_members'::regclass
     and confrelid = 'public.profiles'::regclass
     and contype = 'f'),
  1::bigint,
  'workspace_members.user_id references profiles.id for embeds'
);

select * from finish();
rollback;
