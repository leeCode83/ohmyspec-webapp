-- Workspace CRUD spec (2026-11-21) §2: name guard. One constraint covers
-- every write path (client rename UPDATE, create_workspace RPC, future
-- writers) at the table level: names must be 1-60 characters after btrim,
-- so empty and whitespace-only values are rejected too. Existing rows all
-- shipped through create_workspace, which has rejected empty names since
-- M1, so back-validation cannot fail on live data.
alter table public.workspaces
  add constraint workspace_name_valid
  check (length(btrim(name)) between 1 and 60);
