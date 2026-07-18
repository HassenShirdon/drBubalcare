# Task 2: Per-Hook staleTime Overrides — Report

**Status:** DONE  
**Commit:** `35d409d` — `feat: add per-hook staleTime overrides for TanStack Query caching`

## Changes

Added `staleTime` overrides to 12 `useQuery` calls across 6 files:

| File | Hook | staleTime | Rationale |
|------|------|-----------|-----------|
| `lib/hooks/use-posts.ts` | `usePosts()` | 30 min | News changes rarely |
| `lib/hooks/use-posts.ts` | `usePost(slug)` | 30 min | News changes rarely |
| `lib/hooks/use-doctor.ts` | `useDoctors()` | 15 min | Directory changes infrequently |
| `lib/hooks/use-doctor.ts` | `useDoctor(id)` | 15 min | Directory changes infrequently |
| `lib/hooks/use-lab-results.ts` | `useLabResults()` | 2 min | Patient data needs freshness |
| `lib/hooks/use-lab-results.ts` | `useLabResult(id)` | 2 min | Patient data needs freshness |
| `lib/hooks/use-doctor-cases.ts` | `useDoctorCases()` | 1 min | Clinical data, near-real-time |
| `lib/hooks/use-doctor-cases.ts` | `useDoctorCase(id)` | 1 min | Clinical data, near-real-time |
| `lib/hooks/use-cases.ts` | `useCases()` | 1 min | Clinical data, near-real-time |
| `lib/hooks/use-cases.ts` | `useCase(id)` | 1 min | Clinical data, near-real-time |
| `app/admin/cases/page.tsx` | `admin-cases` query | 1 min | Clinical data, near-real-time |
| `app/admin/cases/page.tsx` | `admin-specialists` query | 1 min | Clinical data, near-real-time |

Mutations (`useSubmitOpinion`, `useCreateCase`) were left unchanged.

## Verification

- `npx tsc --noEmit` — passed with zero errors
