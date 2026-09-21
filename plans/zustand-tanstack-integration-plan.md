# Plan: Zustand + TanStack Query — State Architecture for Dr. Bubal Care

## Current State Audit (Sep 2026)

Both libraries are **already installed and partially adopted**:

### Zustand (`^5.0.14`) — exists in `lib/stores/`
| Store | State | Consumed by |
|---|---|---|
| `ui-store.ts` (`useAppStore`) | `sidebarOpen` | ⚠️ Defined but **never used** by any component |
| `labs-store.ts` (`useLabsStore`) | `filterStatus` | `app/patient/labs/page.tsx` |
| `appointment-store.ts` (`useAppointmentStore`) | booking wizard: `step`, `selectedServiceId`, `selectedDate`, `selectedTime` | `app/directory/[id]/page.tsx` |

### TanStack Query (`^5.101.2`) — provider in `app/Providers.tsx`
- Global defaults: `staleTime: 5min`, `gcTime: 10min`, `refetchOnWindowFocus: false`, `retry: 1`
- Shared hooks: `lib/hooks/use-cases.ts`, `use-doctor-cases.ts`, `use-lab-results.ts`, `use-doctor.ts`, `use-posts.ts`
- ~20 portal pages use `useQuery`/`useMutation` (patient cases/labs, doctor cases/patients/labs-review, admin cases/disputes/specialists/audit-logs/data-requests/edge-cases)

### Gaps found
1. **1 remaining manual `useEffect` + `fetch`**: `components/latest-news-client.tsx` (landing page news cards) — should be `usePosts()`.
2. **Manual `fetch` in event handlers** that should be `useMutation`: `components/file-upload.tsx`, `app/patient/cases/[id]/dispute/page.tsx`, `components/landing-page/contact-section.tsx`, `app/admin/cases/columns.tsx` (specialists dropdown + assign), `app/admin/specialists/columns.tsx` (verify).
3. **Inline `useQuery` + `fetch` duplicated in pages** instead of shared hooks: `app/doctor/patients/page.tsx`, `app/doctor/labs/review/page.tsx`, `app/admin/*` pages.
4. **`useAppStore` (sidebar) is dead code** — no component consumes it.
5. **No query-key factory** — keys are ad-hoc strings (`['cases', id]` vs `['cases', { take, skip }]`), risking cache-invalidation mismatches.
6. **No persisted zustand state** — booking wizard selection is lost on refresh.

---

## Why Both Libraries: Advantages

**Zustand gives us clean client-state management without ceremony.** Our UI state — booking wizard progress, sidebar toggles, filter selections, modal/drawer visibility, multi-step form scratch data — is fundamentally client state: it lives and dies in the browser, is owned solely by the user, and must survive navigation between routes. Zustand stores are plain hooks with no providers, no context-tree re-render penalty, and selector-based subscriptions (`useLabsStore((s) => s.filterStatus)`) mean a component only re-renders when the exact slice it reads changes. For a medical platform with dense admin tables and long case-review pages, that isolation matters: opening a filter dropdown shouldn't re-render a 50-row case table. It also removes prop drilling risk as portals grow — the appointment wizard can read its own state on any step without threading 10 props through the directory page.

**TanStack Query solves the fundamentally different problem of server state.** Cases, opinions, lab results, audit logs, and disputes are persisted remotely, owned by the backend, mutated by other actors (a specialist signing an opinion while the patient is viewing the case), and go stale. Hand-rolled `useEffect` + `fetch` (what `latest-news-client.tsx` still does) gives none of: request deduplication (5 components reading `['cases']` triggers 1 request, not 5), background refetch on window focus, automatic cache invalidation after mutations, retry/backoff on flaky networks, and structural-sharing garbage collection. Our existing `staleTime: 5min` config means a patient navigating from cases list → case detail → back to list sees the list **instantly from cache** with a silent background refresh — no spinner flicker, no wasted API calls.

**Together they enforce the single most important architectural rule: server state never leaks into client state.** The failure mode of a single state library is copying fetched data into a store — then it duplicates, drifts out of sync, and must be manually invalidated. The split is clean: **TanStack Query owns everything that came from `/api` (cases, labs, opinions, disputes, specialists); Zustand owns everything the user created in the UI (wizard steps, filters, sidebar, upload progress, unsaved draft state)**. Caching, dedupe, and invalidation become centralized instead of scattered across 20 pages; UI state stays instant, synchronous, and ephemeral. For this codebase the payoff is concrete: converting the remaining manual-fetch sites to `useMutation` gives every write (dispute filing, file upload, specialist assignment) consistent loading/error states and cache invalidation "for free," and a query-key factory makes `queryClient.invalidateQueries({ queryKey: queryKeys.cases.all })` reliable instead of string-matching luck.

---

## Phased Plan

### Phase 1 — Consolidate & Standardize (low risk, no behavior change)
**Goal:** One idiomatic pattern everywhere; zero new features.

1. **Create query-key factory** — `lib/query-keys.ts`:
   ```ts
   export const queryKeys = {
     cases: { all: ['cases'], list: (f?) => ['cases', 'list', f], detail: (id) => ['cases', 'detail', id] },
     labResults: { all: ['lab-results'], list: ..., detail: (id) => ... },
     posts: { all: ['posts'], list: ['posts','list'], detail: (slug) => ['posts','detail',slug] },
     doctor: { patients: ['doctor','patients'], pendingLabs: ['doctor','labs','pending'] },
     admin: { specialists: ['admin','specialists'], disputes: ..., auditLogs: ..., dataRequests: ..., edgeCases: ... },
   }
   ```
2. **Refactor shared hooks** (`lib/hooks/*`) to use the key factory; align existing page keys (`['admin-specialists']` → factory).
3. **Move inline `useQuery` in pages into `lib/hooks/`**: new `use-admin.ts` (specialists, disputes, audit-logs, data-requests, edge-cases), extend `use-doctor.ts` (patients, pending labs).
4. **Migrate `components/latest-news-client.tsx`** to `usePosts()` — delete its `useEffect`/`useState`/`loaded` state.
5. **Convert event-handler fetches to `useMutation`**: `file-upload.tsx`, dispute page, contact-section, `admin/cases/columns.tsx`, `admin/specialists/columns.tsx`.
6. **Fix `useLabsStore` selector misuse** in `app/patient/labs/page.tsx:17` — destructuring whole store (`const { filterStatus, setFilterStatus } = useLabsStore()`) re-renders on any state change; use `useShallow` or two selectors.

**Affected files:** ~15. **Verify:** `npm run build`, vitest, manual smoke of patient/doctor/admin lists.

### Phase 2 — Zustand Store Hardening & Expansion
**Goal:** Make the UI-state layer first-class.

1. **Reorganize into slices** (`lib/stores/slices/` + combined store) per zustand slices pattern as stores grow: `uiSlice` (sidebar, modals, toasts), `bookingSlice` (appointment wizard), `filtersSlice` (labs, case tables).
2. **Activate the dead `sidebarOpen` store** — wire into `PatientLayout.tsx` / `DoctorLayout.tsx` / `admin-shell.tsx` mobile navigation (replacing local `useState` if present).
3. **Persist booking wizard** with `zustand/middleware` `persist` (sessionStorage, key `dbc-booking-wizard`) — refresh no longer loses `selectedServiceId/date/time`. Add `onRehydrateStorage` hydration guard for Next.js SSR.
4. **SSR hydration pattern**: add a `useHydrated` helper or `skipHydration` + manual `rehydrate()` in a client provider to avoid hydration mismatch warnings.
5. **Add table filter state for case lists** (admin cases, doctor cases, patient cases) into `filtersSlice` — replaces per-page `useState` filters, survives tab switching.

**Affected files:** ~10. **Verify:** booking flow E2E (playwright_tests), hydration check in dev.

### Phase 3 — Query/Mutation UX Polish
**Goal:** Best-in-class perceived performance in the portals.

1. **`useMutation` + optimistic updates** for: specialist verification (admin), case assignment (admin), consent toggle (patient privacy) — rollback on error.
2. **Infinite/paginated queries** for audit logs and case lists (`keepPreviousData`) — remove list flicker between pages.
3. **Polling for in-flight cases**: `refetchInterval` on patient case detail while `status === UNDER_REVIEW` (24-48h review pipeline), so opinion delivery appears without manual refresh.
4. **Devtools**: add `@tanstack/react-query-devtools` + `zustand` Redux-devtools middleware (dev-only) to `app/Providers.tsx`.
5. **Error boundary / QueryErrorResetBoundary** wrapper for portal route groups.

**Affected files:** ~12. **Verify:** vitest + Playwright flows for disputes and assignments.

### Phase 4 — Integration with Existing Layers (NextAuth / Prisma / AI layer)
**Goal:** Align state layer with platform compliance requirements.

1. **Session-scoped caches**: on sign-out/sign-in (`useSession` status change), `queryClient.clear()` to prevent PHI leaking across accounts — critical for a medical platform.
2. **`sessionStorage` not `localStorage`** for any persisted store containing identifiers (booking wizard holds service selections; keep PHI out of stores entirely — per AGENTS.md PHI-safe principles, no names/MRN in client stores).
3. **AI pre-screen / plain-language summary hooks**: add `useAiPrescreen(caseId)`, `usePlainSummary(opinionId)` query hooks in `lib/hooks/` as those features come online (Phase 3 of AGENTS.md roadmap), with `staleTime` tuned to opinion delivery.
4. **Audit-log hooks** with server-side pagination feeding DataTable.

**Affected files:** ~8. **Verify:** multi-account sign-in/out test, GDPR data-deletion flow.

---

## What Is NOT Affected
- `middleware.ts` (NextAuth role gating), Prisma schema, `lib/ai/*` server logic, `lib/schemas/*` (zod forms stay react-hook-form), server components, SEO (`lib/seo.tsx`), next-themes.
- Server-side data fetching in RSC pages stays as-is — TanStack Query is for **client** interactivity only; no `dehydrate/hydrate` needed initially (only portal pages are client-heavy).

## Rule of Thumb (write into AGENTS.md after Phase 1)
> Server data → TanStack Query (`lib/hooks/use-*.ts`, keys from `lib/query-keys.ts`).
> UI/client state → Zustand (`lib/stores/*`, selector access with `useShallow`).
> Never copy query results into a zustand store.
