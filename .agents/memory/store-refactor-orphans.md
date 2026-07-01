---
name: Store refactor orphans
description: What to check after migrating a Next.js app's data layer from props/Supabase fetches into a local reducer store
---

When refactoring a feature (e.g. shops/jobs) from prop-drilled or Supabase-fetched data into a local context/reducer store, the migration typically touches the "read" paths (list/detail views) but can leave "write" paths behind:

- A submission/creation modal that still imports the old fetch-layer function (e.g. `submitShop` from a Supabase client wrapper) instead of the store's `add*` action.
- The button/state that used to open that modal gets dropped when the parent component is simplified, leaving the modal component itself unreachable (no import, no trigger) but still compiling — TypeScript won't flag an unused-but-still-exported component.

**Why:** these gaps don't show up as compile errors or console warnings — the orphaned component still typechecks fine on its own, it just has zero callers. They're best found via `grep` for "who imports this component" and "who calls this old fetch function" after any store-migration refactor.

**How to apply:** after any props/Supabase → local-store migration, grep for the old fetch/write module (e.g. `supabase.ts`) to confirm no remaining callers before deleting it, and grep for every modal/form component to confirm something still renders it with a real trigger (button/state) wired up.

**Read-path variant:** the same migration can also leave a "read" path behind — a detail/standalone page (e.g. a dynamic route like `[id]/page.tsx`) that was written before the store existed may still import and filter the original static data module directly, instead of calling the store hook. It compiles fine and even renders correctly for original seed data, but items added/edited/deleted via the store never show up (or show stale data) on that specific page. Grep every page/component for direct imports of the static data module (e.g. `data.ts`) after a store migration, not just for old fetch-function callers.
