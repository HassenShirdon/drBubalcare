## Task 13: Integration Tests — New AI Routes

### What I Implemented

Added integration tests for three Phase 4 AI routes in `__tests__/integration/ai-routes.test.ts`:

1. **Synthesis route** (`POST /api/ai/synthesis/[caseId]`) — 3 tests:
   - 401 without `x-internal-secret` header
   - 401 with wrong secret
   - 500 when `generateSynthesis` throws

2. **Follow-up route** (`POST /api/ai/followup`) — 3 tests:
   - 401 without session
   - 400 without required fields (`opinionId`, `question`)
   - 500 when `answerFollowUp` throws

3. **Trends route** (`GET /api/ai/trends/[patientId]`) — 3 tests:
   - 401 without session
   - 403 when accessing another patient's trends
   - 200 with trends for own data

Also added helper functions: `synthesisParams`, `trendsParams`, `createRequestWithBody`, `mockSession`.

Mocks added: `@/lib/ai/synthesis`, `@/lib/ai/followup`, `next-auth`, `@/lib/auth`, `@/lib/db`.

### Test Results

All 18 tests pass (9 existing + 9 new). Duration: ~2s.

### Files Changed

- `__tests__/integration/ai-routes.test.ts` (+119 lines)

### Self-Review

- All tests match the task brief exactly
- Follows existing patterns (mock style, describe structure, assertion style)
- No over-engineering — only what was specified

### Commit

- `ee96b49` — `feat: add integration tests for Phase 4 AI routes`
