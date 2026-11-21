-- Spec §7 test #9: a new auth.users row produces exactly one profiles row,
-- with the display name taken from raw_user_meta_data.name.
begin;
\ir helpers.pgsql
select plan(2);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values (
  '11111111-1111-1111-1111-111111111111',
  'profile-test@test.dev',
  crypt('Str0ng!Pass', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Profile Tester"}'
);

select is(
  (select count(*) from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  1::bigint,
  'inserting an auth user creates exactly one profile row'
);

select is(
  (select name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Profile Tester',
  'profile name comes from raw_user_meta_data.name'
);

select * from finish();
rollback;
