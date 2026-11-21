-- Storage lockdown for the imports bucket (spec §4, audit F2). All path
-- checks anchor on the EXACT second segment via storage.foldername — never
-- a LIKE/prefix match — reject any '..' segment, require the workspace to
-- be alive, and require membership. Detailed file handling belongs to the
-- M2 import spec; the bucket is born locked-down.

insert into storage.buckets (id, name, public)
values ('imports', 'imports', false)
on conflict (id) do nothing;

-- Single predicate shared by all four policies (DRY). Returns true only
-- for imports/{workspace_id}/... paths of a live workspace the caller
-- belongs to.
create or replace function public.imports_object_allowed(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    (storage.foldername(object_name))[1] = 'imports'
    and object_name not like '%..%'
    and exists (
      select 1 from public.workspaces w
      where w.id::text = (storage.foldername(object_name))[2]
        and w.deleted_at is null
        and public.is_member(w.id)
    );
$$;

create policy "members read workspace imports" on storage.objects
  for select to authenticated
  using (bucket_id = 'imports' and public.imports_object_allowed(name));
create policy "members write workspace imports" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imports' and public.imports_object_allowed(name));
create policy "members update workspace imports" on storage.objects
  for update to authenticated
  using (bucket_id = 'imports' and public.imports_object_allowed(name))
  with check (bucket_id = 'imports' and public.imports_object_allowed(name));
create policy "members delete workspace imports" on storage.objects
  for delete to authenticated
  using (bucket_id = 'imports' and public.imports_object_allowed(name));
