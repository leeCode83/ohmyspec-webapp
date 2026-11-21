-- PostgREST embed hint (frontend walkthrough finding): workspace_members
-- and profiles have no direct FK — both reference auth.users — so PostgREST
-- cannot resolve the profiles(name) embed on workspace_members (PGRST200).
-- profiles.id is 1:1 with auth.users.id, so this FK is safe and gives the
-- API the relationship it needs. Cascade mirrors the auth.users FK.
alter table public.workspace_members
  drop constraint if exists workspace_members_user_id_profiles_fkey;
alter table public.workspace_members
  add constraint workspace_members_user_id_profiles_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;
