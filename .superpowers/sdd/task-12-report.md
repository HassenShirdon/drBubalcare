# Task 12: E2E Test — Report

## Status: DONE

## Commit
`362682a` — `test: add E2E test for specialist opinion workflow`

## Files Created
- `__tests__/e2e/specialist-opinion-workflow.test.ts` — Full E2E workflow test
- `vitest.config.ts` — Vitest configuration with `@/` path alias resolution

## Test Summary
Single test that exercises the complete specialist opinion workflow across 7 steps:

1. **Patient creates a case** — POST `/api/cases` → 201
2. **Admin verifies doctor** — PATCH `/api/admin/specialists/[id]/verify` → 200
3. **Admin assigns case to doctor** — PATCH `/api/admin/cases/[id]/assign` → 200
4. **Doctor saves draft opinion** — POST `/api/doctor/cases/[id]/opinion` (sign: false) → 200
5. **Patient cannot see draft opinions** — GET `/api/cases/[id]` → opinions array is empty (draft filtered by query)
6. **Doctor signs opinion** — POST `/api/doctor/cases/[id]/opinion` (sign: true) → 200
7. **Patient views signed opinion** — GET `/api/cases/[id]` → opinions array contains the signed opinion

All route handlers are imported directly and called with mock `Request` objects. Auth (`getServerSession`) and database (`prisma`) are mocked via `vi.mock`.

## Concerns
- **Task brief step 1 discrepancy**: The brief says "Admin creates a case" but `POST /api/cases` enforces `role !== 'PATIENT'` → 403. Test uses a PATIENT session for case creation to match the actual implementation.
- **No existing test patterns**: No test files existed in `__tests__/` prior to this task, so vitest was not previously installed and no project conventions existed to follow.
