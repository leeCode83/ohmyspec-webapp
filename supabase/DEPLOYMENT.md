# Deployment checklist — M1 auth backend (pre-cloud validation)

Items that cannot be verified against the local stack alone and must be
re-validated on the hosted Supabase project before the M5 OSS release.

- [ ] **Cloud auth config mirror.** The dashboard auth settings must match
      `supabase/config.toml`: `minimum_password_length = 8`,
      `password_requirements = "lower_upper_letters_digits_symbols"`, and
      `[auth.email] enable_confirmations = false` (MVP; flip confirmations to
      true before M5 OSS release — audit F7).

- [ ] **Hosted force-RLS + security-definer validation.** Confirm the function
      owner bypasses force RLS on hosted Postgres for the signup trigger,
      create_workspace, join_workspace, owner RPCs (regenerate_invite,
      remove_member, delete_workspace), and the policy helpers is_member /
      imports_object_allowed — this gates every auth flow, since all business
      tables are force-RLS with no INSERT policies.

- [ ] **Storage provider validation.** Determine whether the Storage HTTP
      layer normalizes `..` keys before policy evaluation (the DB policy
      rejects them; the provider may rewrite them first) — M2 import spec
      first task.

- [ ] **Weak-password signup rejected by server policy.** Backend spec §7 #11
      (weak password → 422, strong → 200; verified locally) — repeat the
      check after the cloud auth config mirror is applied.

- [ ] **Config nit.** `[db.seed] sql_paths = ["./seed.sql"]` references a file
      the CLI 3.2.0 never generated — add an empty `supabase/seed.sql` or set
      `sql_paths = []` before cloud deploy to silence the seed warning.
