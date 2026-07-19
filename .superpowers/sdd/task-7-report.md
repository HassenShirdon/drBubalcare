# Task 7 Report: Edge Case Cron Job and API Routes

## Status: DONE

## What I Implemented

4 API routes + 1 integration test file:

1. **`app/api/cron/check-no-specialist/route.ts`** — Cron POST endpoint with Bearer token auth. Calls `checkUnmatchedCases()` from the edge case service. Returns 500 on failure.

2. **`app/api/admin/edge-cases/pending/route.ts`** — Admin-only GET endpoint. Returns cases that have been OPEN with no specialist assigned for 4+ hours. Includes patient info.

3. **`app/api/admin/edge-cases/urgent-alert/route.ts`** — Admin-only POST endpoint. Sends urgent alert via `notifyAdmin` + `notifyPatient` for a specific case. Validates caseId/message required, case must exist.

4. **`app/api/cases/[id]/flag-incomplete/route.ts`** — Doctor-only POST endpoint. Calls `flagIncompleteUpload()` to notify patient about incomplete upload with specialist-provided instructions.

5. **`__tests__/integration/edge-cases.test.ts`** — 5 integration tests covering cron auth + call, flag-incomplete auth checks (401/403) and happy path.

## TDD Evidence

### RED
```
npx vitest run __tests__/integration/edge-cases.test.ts
Error: Cannot find package '@/app/api/cron/check-no-specialist/route'
```
Expected failure — route modules don't exist yet.

### GREEN
```
Test Files  1 passed (1)
Tests       5 passed (5)
```
All 5 tests pass after implementation.

## Self-Review Findings

**Fix applied:** The plan's test for the cron route was missing the `Authorization` header. The route requires `Bearer ${process.env.CRON_SECRET}`, so I updated the test to set the env variable and send the header. Added an extra 401 test for missing auth.

## Files Changed
- `app/api/cron/check-no-specialist/route.ts` (new)
- `app/api/admin/edge-cases/pending/route.ts` (new)
- `app/api/admin/edge-cases/urgent-alert/route.ts` (new)
- `app/api/cases/[id]/flag-incomplete/route.ts` (new)
- `__tests__/integration/edge-cases.test.ts` (new)
