# Met Collection Explorer

A small Next.js app for exploring the Metropolitan Museum of Art's public collection. Built as a take-home for Endurance Warranty.

**Live demo:** https://met-explorer-orcin.vercel.app/

## What it does

- **Landing page** — animated masonry of curated highlight artworks
- **`/explore`** — search the full 470k+ object collection with scope toggles (Title / Tags / Artist or Culture), feature filters (Highlights / On View / Has Images), and advanced filters for medium, geography, department, and date range
- **`/explore/[id]`** — detail view with an image gallery, structured metadata, constituent links, tags, and a link back to metmuseum.org

## Quick start

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm start
pnpm lint
```

No environment variables required. The Met Collection API is public and unauthenticated.

## Stack

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · shadcn/ui

## Key decisions

**Server Components fetch data directly.** Rather than building an internal API layer that server components then call, server components hit the Met API at render time. This is the Next.js recommended pattern for data that only your own app needs: no extra network hop, and the full data cache is available.

**Two-tier caching.** Individual object metadata is stable, so those fetches are cached for 24 hours. Search results and department lists use shorter revalidation windows since they're more likely to change. This means repeated queries are fast without serving stale data on things that do update.

**`Promise.allSettled` for fan-out requests.** The Met's search endpoint only returns a list of IDs, so fetching a page of results means one request per object. Running these in parallel and tolerating individual failures means a single flaky response doesn't break the whole page.

**URL as search state.** Every filter and search term lives in the URL via query params. This makes queries shareable and deep-linkable, keeps the server rendering the right content on load, and means the back button works as expected.

**shadcn/ui + Base UI for components.** shadcn gives locally-owned, fully customizable primitives (Button, Badge, Toggle, Pagination, etc.) without fight. Base UI handles the department multi-select combobox, which has better built-in accessibility behavior for that specific pattern.

## Tradeoffs and limitations

- **The Met's search has no ranking and returns every matching ID at once.** I cap the UI at 10,000 results and hydrate one page at a time. A proper implementation would benefit from a dedicated search service, but that's outside the scope of this project.
- **Search results revalidate every 5 minutes rather than being cached per user session.** Fine for a read-heavy public dataset, but worth revisiting at scale.
- **Masonry tile heights are approximations, not computed from actual image dimensions.** Getting true aspect ratios would require server-side image inspection; the fixed values give a reasonable result without the overhead.
- **No test suite.** Given the scope, I prioritized product surface area. If I were continuing I'd start with data layer contract tests, URL serialization unit tests, and an end-to-end smoke test covering the search to detail flow.

## Accessibility

Keyboard-navigable throughout. Specific things implemented: a skip-to-content link, proper landmark regions, toggle buttons that correctly announce their pressed state, filter chip groups with accessible labels, explicit label/input pairing on all advanced filter fields, and descriptive labels on masonry buttons using the artwork title. A proper accessibility audit would be the next step.

## AI tooling

I used Claude as a pair programmer throughout: scaffolding the search form's URL serialization, generating initial types from the Met API docs, troubleshooting, and getting a critical review of the code before submitting. Architecture decisions, caching strategy, data layer design, and UX choices are mine. All generated code was run and read before being applied.

## What I'd do next

1. Test suite and CI
2. A proper accessibility audit
3. Better search result ordering, since the Met API returns IDs with no relevance ranking
4. Per-route error boundaries for more graceful failure states
