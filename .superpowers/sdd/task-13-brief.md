### Task 13: Integration Tests — New AI Routes

**Files:**
- Modify: `__tests__/integration/ai-routes.test.ts`

- [ ] **Step 1: Add synthesis route tests**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
import { POST as synthesisPost } from '@/app/api/ai/synthesis/[caseId]/route';
import { generateSynthesis } from '@/lib/ai/synthesis';

// Add mock at top of file (with other mocks):
vi.mock('@/lib/ai/synthesis', () => ({
  generateSynthesis: vi.fn(),
}));

// Add helper function:
function synthesisParams(caseId: string) {
  return { params: Promise.resolve({ caseId }) };
}

// Add describe block inside 'AI Routes - Auth':
describe('Synthesis route', () => {
  it('returns 401 without x-internal-secret header', async () => {
    const res = await synthesisPost(createRequestWithSecret(undefined), synthesisParams('case-1'));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 401 with wrong x-internal-secret', async () => {
    const res = await synthesisPost(createRequestWithSecret('wrong-secret'), synthesisParams('case-1'));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 500 when generateSynthesis throws', async () => {
    vi.mocked(generateSynthesis).mockRejectedValue(new Error('Case not found'));
    const res = await synthesisPost(createRequestWithSecret('test-secret'), synthesisParams('nonexistent-case'));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Synthesis generation failed');
  });
});
```

- [ ] **Step 2: Add follow-up route tests**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
import { POST as followupPost } from '@/app/api/ai/followup/route';
import { answerFollowUp } from '@/lib/ai/followup';

// Add mock at top of file:
vi.mock('@/lib/ai/followup', () => ({
  answerFollowUp: vi.fn(),
}));

// Add describe block inside 'AI Routes - Auth':
describe('Follow-up route', () => {
  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await followupPost(createRequestWithBody({ opinionId: 'op-1', question: 'What does this mean?' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 without required fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const res = await followupPost(createRequestWithBody({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('opinionId and question are required');
  });

  it('returns 500 when answerFollowUp throws', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    vi.mocked(answerFollowUp).mockRejectedValue(new Error('Opinion not found'));
    const res = await followupPost(createRequestWithBody({ opinionId: 'nonexistent', question: 'What does this mean?' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Follow-up Q&A failed');
  });
});
```

- [ ] **Step 3: Add trends route tests**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
import { GET as trendsGet } from '@/app/api/ai/trends/[patientId]/route';

// Add helper function:
function trendsParams(patientId: string) {
  return { params: Promise.resolve({ patientId }) };
}

// Add describe block inside 'AI Routes - Auth':
describe('Trends route', () => {
  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await trendsGet(createRequest(), trendsParams('patient-1'));
    expect(res.status).toBe(401);
  });

  it('returns 403 when accessing other patient trends', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const res = await trendsGet(createRequest(), trendsParams('patient-2'));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Forbidden');
  });

  it('returns 200 with trends for own data', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    vi.mocked(prisma.trendAnalysis.findMany).mockResolvedValue([]);
    const res = await trendsGet(createRequest(), trendsParams('patient-1'));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 4: Add helper function for request with body**

Add to `__tests__/integration/ai-routes.test.ts`:

```typescript
function createRequestWithBody(body: unknown): Request {
  return { json: async () => body } as unknown as Request;
}
```

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add __tests__/integration/ai-routes.test.ts
git commit -m "feat: add integration tests for Phase 4 AI routes"
```
