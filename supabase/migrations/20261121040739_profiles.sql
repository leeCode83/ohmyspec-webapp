-- Public profile of an auth user. Populated exclusively by the signup
-- trigger; the application never inserts into this table (spec §1).

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null default '',
  byok_keys     jsonb not null default '{}',
  chat_provider text,
  created_at    timestamptz not null default now()
);

-- Security definer so the insert succeeds despite insert being closed by
-- RLS (Task 4). Fills the display name from the signup metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
