# Task 9 Report: Dispute Types, Schema, and Service

## Status: DONE

## What I Implemented

Created the dispute resolution system foundation with 4 files:

1. **`lib/disputes/types.ts`** — `FileDisputeParams`, `PeerReviewCandidate`, `DisputeStatus` enum
2. **`lib/schemas/dispute.schema.ts`** — Zod schemas: `fileDisputeSchema`, `triageDisputeSchema`, `resolveDisputeSchema`, `assignPeerReviewSchema`
3. **`lib/disputes/service.ts`** — 5 exported functions:
   - `fileDispute()` — Creates dispute, logs audit event, notifies admin
   - `getPeerReviewCandidates()` — Finds 3 candidate specialists in same specialty, excluding original
   - `triageDispute()` — Sets UNDER_REVIEW (valid) or DISMISSED (invalid)
   - `assignPeerReview()` — Creates draft SpecialistOpinion, links to dispute, logs audit
   - `resolveDispute()` — Sets RESOLVED with resolution text, logs audit
4. **`__tests__/unit/disputes/service.test.ts`** — 8 unit tests covering all functions

## TDD Evidence

**RED:** Ran `npx vitest run __tests__/unit/disputes/service.test.ts`
```
Error: Cannot find package '@/lib/disputes/service'
```
Expected: module not found since implementation doesn't exist yet.

**GREEN:** Ran `npx vitest run __tests__/unit/disputes/service.test.ts`
```
Test Files  1 passed (1)
    Tests  8 passed (8)
```

## Test Results

8/8 passing, output pristine — no warnings or noise.

Full suite: 93 passed, 2 pre-existing E2E failures (unrelated — `prisma.specialistOpinion.count` mock issue in `opinion/route.ts`).

## Files Changed

| File | Action |
|------|--------|
| `lib/disputes/types.ts` | Created |
| `lib/disputes/service.ts` | Created |
| `lib/schemas/dispute.schema.ts` | Created |
| `__tests__/unit/disputes/service.test.ts` | Created |

## Commit

`35147f9` feat(disputes): add dispute types, schema, and service with full workflow

## Self-Review Findings

- **Completeness:** All 5 functions implemented per plan spec. Types, Zod schemas, and service all present.
- **Quality:** Follows existing patterns (audit logger, notification service). Clean imports, no circular dependencies.
- **Discipline:** No overbuilding. Only built what was requested.
- **Testing:** Tests verify real behavior (create + audit + notification chain, state transitions, error cases). 8/8 passing.

No concerns.

---

## Code Review Fix (Status Guards)

### What Was Fixed

Added status validation to two functions in `lib/disputes/service.ts`:

1. **`triageDispute`** — Now verifies dispute exists and status is `OPEN` before allowing triage. Throws if dispute is in any other state (e.g., `RESOLVED`, `DISMISSED`).
2. **`resolveDispute`** — Now verifies dispute exists and status is `PEER_REVIEW_ASSIGNED` or `UNDER_REVIEW` before allowing resolution. Throws if dispute is in any other state (e.g., `PENDING`, `OPEN`).

Added 2 new tests to `__tests__/unit/disputes/service.test.ts`:
- `triageDispute throws when dispute is not OPEN`
- `resolveDispute throws when dispute is not in resolvable status`

Existing tests updated to mock `findUnique` for the new status check flow.

### Test Results After Fix

```
Test Files  1 passed (1)
     Tests  10 passed (10)
  Duration  5.23s
```

10/10 passing — 8 original + 2 new guard tests.

### Commit

`10cef5a` fix(disputes): add status guards to triageDispute and resolveDispute
