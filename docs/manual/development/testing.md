# Testing

Testing strategy, configuration, and procedures for the Dr. Bubal Care platform.

## Test Types

The test suite is organized into three tiers:

| Type | Directory | Purpose | Runs On |
|------|-----------|---------|---------|
| **Unit** | `__tests__/unit/` | Test individual functions and modules in isolation | Every commit |
| **Integration** | `__tests__/integration/` | Test API routes and module interactions with mocked dependencies | Every commit |
| **End-to-end** | `__tests__/e2e/` | Test complete multi-step workflows across the system | Before merge/deploy |

## Test Framework

The project uses **Vitest** as the test runner.

Configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
});
```

The `@` alias mirrors the `tsconfig.json` path alias so tests can import project modules the same way application code does.

## Running Tests

```bash
# Run all tests
npx vitest

# Run tests once (CI mode)
npx vitest run

# Run with coverage
npx vitest run --coverage

# Run a specific test file
npx vitest run __tests__/unit/phi-stripper.test.ts

# Run tests matching a pattern
npx vitest run -t "stripPHI"

# Watch mode (re-runs on file changes)
npx vitest --watch
```

## Test File Conventions

- Test files use the `.test.ts` or `.test.tsx` extension
- Test files sit in the corresponding `__tests__/` subdirectory
- Test file names describe the module or feature being tested (e.g., `phi-stripper.test.ts`, `ai-routes.test.ts`)
- Use `describe` blocks to group related tests
- Use descriptive `it` block names that state the expected behavior

```typescript
import { describe, it, expect } from 'vitest';
import { stripPHI } from '@/lib/ai/phi-stripper';

describe('stripPHI', () => {
  it('strips patient names when provided in context', () => {
    const input = 'Patient John Doe presents with chest pain.';
    const result = stripPHI(input, { patientName: 'John Doe' });
    expect(result).toContain('[PATIENT]');
    expect(result).not.toContain('John Doe');
  });
});
```

## Coverage Goals

Aim for high coverage on critical paths:

| Area | Target | Rationale |
|------|--------|-----------|
| PHI stripping | 100% | Compliance-critical; must catch all identifiable data |
| Audit logging | 100% | Every data access must be logged |
| AI route auth | 100% | Unauthorized access to AI endpoints is a security risk |
| API route validation | 95%+ | Input validation prevents injection and data corruption |
| Business logic services | 90%+ | Core domain logic must be correct |
| UI components | Best effort | Focus on behavior-critical components |

## Critical Test Areas

These areas are security-sensitive or compliance-critical and require thorough test coverage:

**PHI stripping** (`__tests__/unit/phi-stripper.test.ts`)
- Patient name removal
- Email, phone, DOB, MRN, and address redaction
- Preservation of clinical content
- Edge cases (empty strings, text with no PII)

**API route authentication** (`__tests__/integration/ai-routes.test.ts`)
- 401 responses for missing/invalid auth headers
- 403 responses for unauthorized role access
- Session-based vs. secret-based auth paths

**Audit logging** (`__tests__/integration/audit-logs.test.ts`)
- Every read/write to patient data produces an audit entry
- Audit entries include correct metadata (user, action, resource)

**GDPR compliance** (`__tests__/integration/gdpr.test.ts`)
- Data export and deletion workflows
- Consent management

**Edge case handling** (`__tests__/integration/edge-cases.test.ts`)
- Urgent findings detection
- No-specialist-matched scenarios
- Incomplete upload handling

## Mocking Strategies

The project uses Vitest's built-in mocking (`vi.mock`, `vi.fn`, `vi.mocked`):

### Module mocking

Mock entire modules at the top of the test file, before importing the code under test:

```typescript
vi.mock('@/lib/db', () => ({
  prisma: {
    case: { findMany: vi.fn(), create: vi.fn() },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/ai/prescreen', () => ({
  generatePrescreen: vi.fn(),
}));
```

### Mock data

Test data is created inline within tests. Helper functions create common request objects:

```typescript
function createRequestWithSecret(secret?: string): Request {
  const headers = new Headers();
  if (secret !== undefined) headers.set('x-internal-secret', secret);
  return new Request('http://localhost', { method: 'POST', headers });
}

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}
```

### What to mock

- **Database calls** (`@/lib/db`) — always mock Prisma to avoid needing a real database
- **External APIs** (OpenAI, Stripe) — never call real external services in tests
- **Auth** (`next-auth`) — mock `getServerSession` to control the user context
- **AI modules** — mock the AI feature functions to test route logic without LLM calls
- **Next.js internals** (`next/server`) — mock `NextResponse` for API route tests

### What NOT to mock

- Pure functions (like `stripPHI`) — test them directly
- Zod schemas — test actual validation behavior
- Utility functions (`lib/utils.ts`)

## CI/CD Integration

Tests run automatically in the CI pipeline:

```yaml
# Example CI step
- name: Run tests
  run: npx vitest run

- name: Lint
  run: pnpm lint

- name: Type check
  run: npx tsc --noEmit
```

The pipeline should:

1. Run `pnpm install` (with lockfile)
2. Run `npx prisma generate` (generate client before tests)
3. Run `npx vitest run` (execute all tests)
4. Run `pnpm lint` (ESLint check)
5. Run `npx tsc --noEmit` (TypeScript type check)

All steps must pass before merging. A failing test blocks the merge.
