# team-roster — agent notes

Roster: a searchable team directory on Hanzo. Vite + React 19 + `@hanzo/gui` (UI)
+ `@hanzo/iam` (auth) + `@hanzo/base` (data). Forked from the canonical
hanzo-starter — same provider stack, vite config, auth, and deploy contract.
Keep it minimal and REAL — every surface must build and run, no fabricated UI.

## One way, decomplected

- **Providers** (`src/providers.tsx`, unchanged from the starter) mount in the
  canonical order: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token, rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **One collection** — `people(name, role, team, email, avatar, bio)`. `team` is
  free text; the directory derives its filter set and each team's color from the
  distinct values (`teamNames`/`colorForTeam` in `src/lib/roster.ts`). No second
  table.
- **One Route value** drives the signed-in shell (`src/views/home.tsx`):
  `{ k:'list' } | { k:'profile', id } | { k:'edit', person }`. No router.
- **UI is one system** — `@hanzo/gui` primitives only. The light surface is one
  explicit palette (`UI` in `roster.ts`); atoms live in `src/views/kit.tsx`, and
  the views compose them.

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (unchanged):
  (1) alias `react-native` → `react-native-web`, (2) `define`
  `process.env.TAMAGUI_TARGET` / `NODE_ENV` / `__DEV__`, (3) `dedupe`
  react/react-dom/react-native-web.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`alignSelf`/
  `borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/`self`/
  `rounded`/`text` shorthands. Shorthands pass at runtime but FAIL `tsc`.
- **This `Button` does NOT take `color`/`fontWeight`.** Those props are not on the
  button frame — the label must be a `<Text color… fontWeight…>` child. `kit.tsx`
  wraps this once as `Primary` / `Ghost`; use them (or a `<Text>` child) rather
  than styling `Button` text directly, or `tsc` fails.
- **Light everywhere via `<Theme name="light">`** wrapping the tree in `app.tsx`,
  so component defaults (input placeholders, etc.) read on the light surface. The
  providers keep the starter's `defaultTheme="dark"`; the app-level Theme wins.
- **Avatars render offline.** `PersonAvatar` shows the `avatar` URL when set, else
  a colored initials circle — so the landing preview and cards always draw.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract** — the `databaseSchema` DDL the deploy
  translates into the `people` Base collection (`provisionBaseFromDDL`). Keep it
  in lockstep with `directory.tsx` · `profile.tsx` · `edit.tsx`.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from object
  storage. No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the `people`
  collection (org-scoped, IAM-native). Runtime read/write is browser →
  `VITE_HANZO_BASE_URL` with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_HANZO_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback`. Production needs a `https://*.hanzo.app/auth/callback`
  wildcard on the shared client (or a per-app `hanzo-team-roster` client).

## Proven

`tsc --noEmit` clean · `vite build` → `dist/` · renders under Vite with zero
console errors · `login()` performs a real PKCE S256 redirect to hanzo.id.

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
