-- Hanzo Base schema for Roster — the `databaseSchema` DDL.
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- id/created/updated/owner/org itself, so they are never re-declared here.
-- Every row is stamped with the verified IAM owner+org and is org-scoped: Base
-- applies the list/view/create/update/delete rule `@request.auth.org_id = org`,
-- so a member of your org reads/writes the row and other orgs cannot see it.
--
-- Keep this in lockstep with what the app reads/writes
-- (src/lib/roster.ts + src/views/directory.tsx · profile.tsx · edit.tsx).

-- People — one row per teammate. `team` is free text; the directory derives its
-- filter set and each team's color from the distinct values. `avatar` is an
-- optional image URL — empty falls back to a colored initials avatar.
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name   TEXT NOT NULL,
  role   TEXT NOT NULL DEFAULT '',
  team   TEXT NOT NULL DEFAULT '',
  email  TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  bio    TEXT NOT NULL DEFAULT ''
);
