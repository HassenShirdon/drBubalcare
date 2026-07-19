# Task 15: Update Existing E2E Test with AI Steps

## Status: Complete

## Commit
`695b978` — `test(e2e): add AI trigger verification to Phase 1 happy path`

## Test Results
All 29 tests pass (3 new + 26 existing):

```
 Test Files  5 passed (5)
      Tests  29 passed (29)
   Duration  2.05s
```

## What Was Done

Created `__tests__/e2e/phase1-happy-path.test.ts` with 3 test cases:

### 1. Full happy path with AI trigger verification
The main test walks through the complete specialist opinion workflow and verifies AI triggers at each critical step:

- **Step 4 (File Upload):** After patient uploads records, verifies `fetch` was called to `POST /api/ai/prescreen/{caseId}` with correct `x-internal-secret` header. This confirms the fire-and-forget pre-screening trigger in `app/api/cases/[id]/records/route.ts:96`.
- **Step 6 (Opinion Signing):** After doctor signs opinion, verifies `fetch` was called to `POST /api/ai/summary/{opinionId}` with correct headers. This confirms the fire-and-forget summary trigger in `app/api/doctor/cases/[id]/opinion/route.ts:87`.
- **Step 7 (Case View):** Verifies the case API returns AI prescreen data and plain-language summary data via the `include` relations in `app/api/cases/[id]/route.ts:32-36`.

### 2. Subsequent uploads don't re-trigger pre-screening
Verifies that the `recordCount === 1` guard in the records route correctly prevents re-triggering AI pre-screening on additional file uploads.

### 3. Draft saves don't trigger summary generation
Verifies that saving a draft opinion (without signing) does NOT trigger the summary generation fetch call.

## Mocking Approach

- **`global.fetch`:** Mocked in `beforeEach` to prevent actual HTTP calls and capture invocation arguments for assertion. Restored in `afterEach`.
- **`fs/promises`:** Mocked to prevent disk writes during file upload steps.
- **`prisma`:** All relevant models mocked with return values matching the schema structure.
- **No OpenAI calls:** The AI routes themselves are not invoked — only the trigger mechanism (fetch call) is verified.

## Concerns

None. All tests pass cleanly and the existing test suite is unaffected.
