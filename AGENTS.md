# Agent guide

Canonical instructions for this repo live in [`LLM.md`](./LLM.md) (and its
`CLAUDE.md` symlink). Read it before changing anything.

TL;DR: Vite + React 19 + `@hanzo/gui` + `@hanzo/iam` + `@hanzo/base`. A searchable
team directory — three views (directory grid · person profile · edit) over one
org-scoped `people` collection. Keep it minimal and real. `@hanzo/gui` needs the
react-native-web alias + Tamagui defines in `vite.config.ts` and uses Tamagui
LONGHAND props (tsc enforces this); this `Button` takes its label as a `<Text>`
child, not `color`/`fontWeight` props. `schema.sql` is the Base data contract.
Prove changes with `npm run build` (tsc + vite). Never build a container image
locally — Hanzo Cloud owns deploys.
