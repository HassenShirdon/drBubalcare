# Task 4: Audit Logs API Route — Report

## What I Implemented

- **`app/api/admin/audit-logs/route.ts`**: GET endpoint for admin-only audit log listing with pagination and filters
- **`__tests__/integration/audit-logs.test.ts`**: 4 integration tests verifying auth, RBAC, pagination, and filter behavior

## What I Tested

| Test | Result |
|------|--------|
| Returns 401 without session | ✅ PASS |
| Returns 403 for non-admin users | ✅ PASS |
| Returns paginated audit logs for admin | ✅ PASS |
| Filters by action | ✅ PASS |

**4/4 passing, output pristine (no warnings or noise).**

## TDD Evidence

**RED:**
```
FAIL  __tests__/integration/audit-logs.test.ts
Error: Cannot find package '@/app/api/admin/audit-logs/route'
```
Expected: module not found (route doesn't exist yet).

**GREEN:**
```
Test Files  1 passed (1)
Tests  4 passed (4)
```

## Files Changed

- `app/api/admin/audit-logs/route.ts` (created)
- `__tests__/integration/audit-logs.test.ts` (created)

## Self-Review

**Completeness:** All requirements met — admin-only access, pagination (limit/offset with cap at 100), filters (action, resourceType, userId, startDate, endDate), `Cache-Control: private, no-store` header.

**Quality:** Follows existing API route patterns exactly — session check, role check, Prisma queries, `NextResponse.json()`. Names match the plan.

**Discipline:** No overbuilding. Only what was requested.

**Testing:** Tests verify behavior (auth, RBAC, query params passed to Prisma) not just mocks. TDD followed correctly.

## Concerns

None.

---

## Code Review Fix: NaN Query Param Propagation

**Commit:** `1ed6053` — `fix: default NaN query params in audit-logs endpoint`

### What Was Fixed

Malformed query params (`?limit=abc&offset=xyz`) caused `parseInt` to return `NaN`, which propagated through `Math.min` and into Prisma's `take`/`skip`, resulting in unhandled 500 errors.

**`app/api/admin/audit-logs/route.ts:14-15`** — Added `|| 50` / `|| 0` fallbacks so NaN defaults to safe values:

```typescript
const limit = Math.min(parseInt(searchParams.get('limit') ?? '50') || 50, 100);
const offset = parseInt(searchParams.get('offset') ?? '0') || 0;
```

### Test Results After Fix

| Test | Result |
|------|--------|
| Returns 401 without session | ✅ PASS |
| Returns 403 for non-admin users | ✅ PASS |
| Returns paginated audit logs for admin | ✅ PASS |
| Falls back to safe defaults for malformed limit/offset | ✅ PASS (new) |
| Filters by action | ✅ PASS |

**5/5 passing.**
