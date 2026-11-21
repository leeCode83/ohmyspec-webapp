-- Spec §6.2 helper hygiene: policy helpers are internal — clients never
-- call them directly. REVOKE from public, then GRANT to authenticated:
-- policy expressions run with the querying user's rights, so revoking
-- WITHOUT the grant would break every authenticated read and all four
-- storage policies. Do not copy the bare-revoke pattern used for
-- generate_invite_code (which no policy calls).
revoke execute on function public.is_member(uuid) from public;
grant execute on function public.is_member(uuid) to authenticated;
revoke execute on function public.imports_object_allowed(text) from public;
grant execute on function public.imports_object_allowed(text) to authenticated;
