# Kajiado Directory — Virtual Stroll

An interactive satellite map + merchant directory for Kajiado County, Kenya. Users can explore towns, fly the map to each location, and browse local merchants.

## Run & Operate

- `pnpm --filter @workspace/kajiado-directory run dev` — run the Next.js app (port 3000)
- `pnpm --filter @workspace/api-server run dev` — run the Express API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase credentials (see SQL schema in src/lib/supabase.ts)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Next.js 14 (App Router), Tailwind CSS v3
- Map: Leaflet + react-leaflet, Esri World Imagery satellite tiles
- DB: Supabase (PostgreSQL) — client in `src/lib/supabase.ts`
- API: Express 5 (existing api-server artifact)
- Build: Next.js (frontend), esbuild CJS bundle (api-server)

## Where things live

- `artifacts/kajiado-directory/src/app/page.tsx` — main split-screen layout
- `artifacts/kajiado-directory/src/components/map/MapComponent.tsx` — Leaflet map (SSR-disabled via dynamic import)
- `artifacts/kajiado-directory/src/components/ui/TownSidebar.tsx` — town list + merchant directory
- `artifacts/kajiado-directory/src/components/ui/MerchantCard.tsx` — merchant card UI
- `artifacts/kajiado-directory/src/lib/data.ts` — mock towns + merchants data
- `artifacts/kajiado-directory/src/lib/types.ts` — TypeScript interfaces (Town, Shop)
- `artifacts/kajiado-directory/src/lib/supabase.ts` — Supabase client + SQL schema comments
- `artifacts/kajiado-directory/tailwind.config.ts` — design tokens (ochre, acacia, savanna)

## Architecture decisions

- **Dynamic import with ssr: false** for MapComponent — Leaflet requires the browser DOM; SSR rendering causes hydration errors.
- **leaflet-defaulticon-compatibility** — fixes the broken default marker icon bug in Next.js/webpack environments automatically.
- **z-index layering** — map is z-index 0, navbar/sidebar is z-index 50 to prevent Leaflet controls from overlapping UI chrome.
- **Mock data first** — `src/lib/data.ts` provides 5 Kitengela + 3 Rongai merchants for demo. Replace with Supabase calls when DB is wired up.
- **Tailwind v3** with classic PostCSS config — used instead of v4 because Next.js 14's Turbopack has incomplete v4 support.

## Product

- Split-screen: full-height Esri satellite map on the left, scrollable town+merchant directory on the right.
- Five towns: Kitengela, Kajiado Town, Rongai, Ngong, Namanga — each with lat/lng for map flyTo.
- Click a town in the sidebar → map smoothly flies to it (1.4s animation) and opens a popup.
- Kitengela shows 5 mock merchants; Rongai shows 3. Other towns show an empty state.
- Premium badge (⭐) for featured merchants; category pills with custom colors.
- Design tokens: Ochre (#C36F48), Acacia (#4F7942), Savanna (#FCFAFA).

## Supabase SQL Schema

Run the SQL in `artifacts/kajiado-directory/src/lib/supabase.ts` (the comment block) in the Supabase SQL Editor to create `towns` and `shops` tables with RLS policies.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always use `dynamic(() => import(...), { ssr: false })` for any Leaflet component — never import it at the top level in a Next.js page/layout.
- The Leaflet CSS must be imported inside the client-side MapComponent, not in globals.css, to avoid SSR issues.
- `pnpm run dev` at the workspace root is NOT supported — use `pnpm --filter @workspace/kajiado-directory run dev` or the workflow.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
