-- Invariant 1 backstop (spec §2 "exactly one owner"): a partial unique
-- index makes the single-owner rule a database-level guarantee, closing
-- every path the trigger alone cannot cover — UPDATE promotion, statements
-- that re-target workspace_id without touching role, and concurrent owner
-- inserts. The trigger keeps the friendly error messages; this index is
-- the airtight floor beneath it.
create unique index one_owner_per_workspace
  on public.workspace_members (workspace_id)
  where role = 'owner';

-- Widen the trigger to fire on any UPDATE (not just `of role`) and add the
-- UPDATE-promotion branch so the common paths still raise the friendly
-- messages before the index raises a generic 23505.
create or replace function public.enforce_workspace_owner_invariant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'owner' then
    if exists (
      select 1 from public.workspace_members
      where workspace_id = new.workspace_id
        and role = 'owner'
        and user_id <> new.user_id
    ) then
      raise exception 'A workspace can only have one owner';
    end if;
  end if;

  if tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner' then
    raise exception 'The owner role cannot be demoted';
  end if;

  return new;
end;
$$;

drop trigger enforce_workspace_owner_invariant on public.workspace_members;
create trigger enforce_workspace_owner_invariant
  before insert or update on public.workspace_members
  for each row execute function public.enforce_workspace_owner_invariant();
