# Task 12: Dispute Pages (Patient + Admin) — Report

## What Was Implemented

Created 4 UI files for dispute management:

1. **`app/patient/cases/[id]/dispute/page.tsx`** — Patient dispute filing form
   - Textarea for reason (min 20 chars)
   - POST to `/api/cases/${caseId}/disputes`
   - Redirects to case detail on success
   - Error handling and loading states

2. **`app/admin/disputes/columns.tsx`** — DataTable column definitions
   - Status badge with color coding (Pending/Under Review/Peer Review/Resolved/Dismissed)
   - Patient name, case ID, filed date columns
   - "View" link to dispute detail

3. **`app/admin/disputes/page.tsx`** — Admin disputes list page
   - Fetches from `GET /api/admin/disputes`
   - DataTable with search by patient name
   - Loading skeleton

4. **`app/admin/disputes/[id]/page.tsx`** — Admin dispute detail page
   - Displays original opinion, patient reason, peer review (if exists)
   - Triage workflow (Mark Valid / Dismiss) for PENDING disputes
   - Peer review assignment for UNDER_REVIEW disputes (lazy-loads candidates on hover)
   - Resolution form for PEER_REVIEW_ASSIGNED disputes
   - Resolution display for resolved disputes

Also created **`components/ui/textarea.tsx`** (shadcn component) since it was missing.

## Testing

**No test files were specified in the plan for Task 12.** The plan only lists UI page creation (Steps 1-5 are all file creation + commit). This is consistent with the pattern: earlier tasks (1-11) had explicit test files in their plan, while UI page tasks typically do not include component tests.

## TDD Evidence

- **RED:** N/A — Plan did not specify test files for this task
- **GREEN:** N/A — No tests to run per plan specification

## Verification

- **TypeScript:** `npx tsc --noEmit` — 0 errors in new files (pre-existing errors in `lib/audit/logger.ts` and `lib/disputes/service.ts` from earlier tasks only)
- **Lint:** `next lint` — 0 warnings/errors in new files (pre-existing warnings in other files only)

## Files Changed

| File | Action |
|------|--------|
| `components/ui/textarea.tsx` | Created |
| `app/patient/cases/[id]/dispute/page.tsx` | Created |
| `app/admin/disputes/columns.tsx` | Created |
| `app/admin/disputes/page.tsx` | Created |
| `app/admin/disputes/[id]/page.tsx` | Created |

## Self-Review

**Completeness:** All 4 files from the plan are implemented exactly as specified. The Textarea component dependency was also created.

**Quality:** Code follows existing patterns — same `"use client"` directive, same motion/react animations, same shadcn/ui components, same styling conventions (Tailwind classes matching existing pages).

**Discipline:** No overbuilding. Implemented exactly what the plan specified. No extra features.

**Testing:** No tests were required by the plan for this task.

## Concerns

None.

---

## Code Review Fix (Round 2)

### What Was Fixed

**File:** `app/admin/disputes/[id]/page.tsx` — `PeerReviewAssignment` component

1. **Error handling for `loadCandidates()` and `assign()`**
   - `loadCandidates`: Added `try/catch` with `setError()` — previously a failed fetch silently showed "No matching specialists found"
   - `assign()`: Migrated to `useMutation` which natively surfaces errors; previously failed assignments left no feedback

2. **Replaced `window.location.reload()` with `useMutation` + `invalidateQueries`**
   - `assign()` now uses `useMutation` with `onSuccess` calling `queryClient.invalidateQueries({ queryKey: ["admin-dispute", disputeId] })` — consistent with `triageMutation` and `resolveMutation`
   - Removed `assigning` local state in favor of `assignMutation.isPending`

3. **Added `error` state for user-visible error messages**
   - Error displayed above candidates list when present
   - Empty state text now only shows when there's no error

### Test Results

- **TypeScript:** `npx tsc --noEmit` — 0 new errors in edited file
- **Lint:** `next lint` — 0 warnings/errors in edited file
- Pre-existing errors in `lib/disputes/service.ts` and `lib/audit/logger.ts` remain unchanged

### Commit

- `2806067` — `fix: add error handling and use mutation pattern in PeerReviewAssignment`
