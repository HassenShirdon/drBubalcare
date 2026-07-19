# Task 14: Write Integration Tests for AI Routes

## Status: COMPLETE

## Commit SHA
`6235692e8afb3840be20cc06b51958f3d4e43357`

## Test Results
All 9 tests passed:

```
 __tests__/integration/ai-routes.test.ts
   AI Routes - Auth
     Pre-screening route
       ✓ returns 401 without x-internal-secret header
       ✓ returns 401 with wrong x-internal-secret
       ✓ returns 500 when generatePrescreen throws
     Routing route
       ✓ returns 401 without x-internal-secret header
       ✓ returns 401 with wrong x-internal-secret
       ✓ returns 500 when matchSpecialist throws
     Summary route
       ✓ returns 401 without x-internal-secret header
       ✓ returns 401 with wrong x-internal-secret
       ✓ returns 500 when generateSummary throws

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Duration  1.59s
```

## Coverage
- **3 routes tested:** prescreen, routing, summary
- **3 auth scenarios per route:** missing header (401), wrong secret (401), valid secret with failing backend (500)
- **Mocking approach:** Mocked `next/server` (NextResponse), each AI service function (`generatePrescreen`, `matchSpecialist`, `generateSummary`)

## Notes
- Project uses **Vitest** (not Jest) — matched existing test patterns from `__tests__/e2e/` and `__tests__/unit/`
- All three routes share identical auth pattern: check `x-internal-secret` header against `process.env.INTERNAL_API_SECRET`
- Pre-screening and summary routes return streaming responses from their AI functions; routing returns JSON. Tests verify auth/error paths which are all JSON.
- Set `process.env.INTERNAL_API_SECRET = 'test-secret'` in beforeEach to ensure consistent env

## Concerns
None. Tests are lightweight, fast (1.59s), and don't hit any external services.
