# Task 5: Cache Invalidation Audit Report

## Status: DONE — No changes needed

All mutations already invalidate the correct query caches.

## Audit Results

| File | Mutation | Invalidated Key(s) | Match? |
|------|----------|--------------------|--------|
| `lib/hooks/use-doctor-cases.ts` | `useSubmitOpinion` | `['doctor-cases']`, `['doctor-case']` | ✅ |
| `lib/hooks/use-cases.ts` | `useCreateCase` | `['cases']` | ✅ |
| `app/admin/cases/page.tsx` | `assignMutation` | `['admin-cases']` | ✅ |
| `app/admin/specialists/verify-button.tsx` | `mutation` | `['admin-specialists']` | ✅ |
| `app/patient/cases/new/page.tsx` | Uses `useCreateCase` hook | `['cases']` (via hook) | ✅ |

## Verification

- `npx tsc --noEmit` passed with zero errors.
