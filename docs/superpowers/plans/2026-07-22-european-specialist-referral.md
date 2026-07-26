# European Specialist Referral — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `EUROPEAN_REFERRAL` service type that lets patients request specialist matching in Europe, with admin coordination and full case tracking.

**Architecture:** Add `EUROPEAN_REFERRAL` to the existing `ServiceType` enum. Create a `ReferralCoordination` model linked 1:1 to `Case` for referral-specific data and status. Admin updates coordination via new `/api/referrals/[caseId]` endpoints. Reuses existing Case infrastructure (records, audit logs, disputes) with minimal branching on `serviceType`.

**Tech Stack:** Prisma (PostgreSQL), Next.js 15 App Router, Zod, TypeScript

## Global Constraints

- Follow existing Prisma schema patterns (cuid ids, DateTime defaults, cascade deletes)
- Follow existing API patterns (getServerSession, role checks, NextResponse.json)
- All new enums follow the `UPPER_CASE` convention
- Services without payment processing must not reference payment fields

## File Structure

| File | Responsibility | Action |
|------|---------------|--------|
| `prisma/schema.prisma` | Schema: new enums + ReferralCoordination model | Modify |
| `lib/schemas/case.schema.ts` | Zod validation for case creation | Modify |
| `lib/constants.ts` | Display labels for service types and statuses | Modify |
| `lib/generated/prisma/enums.ts` | Auto-generated enum constants | Regenerate |
| `lib/generated/prisma/models/ReferralCoordination.ts` | Auto-generated model type | Regenerate |
| `app/api/cases/route.ts` | GET: include referralCoordination for referral cases | Modify |
| `app/api/cases/[id]/route.ts` | GET: include referralCoordination in detail view | Modify |
| `app/api/cases/[id]/records/route.ts` | Skip AI pre-screening trigger for referral cases | Modify |
| `app/api/referrals/[caseId]/route.ts` | New: GET + PATCH for referral coordination | Create |
| `app/api/admin/cases/route.ts` | GET: include referralCoordination in admin view | Modify |
| `app/api/admin/cases/[id]/assign/route.ts` | May need to skip assignment check for referral | Check |
| `__tests__/e2e/phase1-happy-path.test.ts` | Mock + test euro referral creation | Modify |
| `__tests__/e2e/referral-workflow.test.ts` | E2E test for full referral workflow | Create |

---

### Task 1: Prisma schema changes

**Files:**
- Modify: `prisma/schema.prisma:51-56` (add to ServiceType enum)
- Modify: `prisma/schema.prisma` (add new enums + model after existing enums)

- [ ] **Step 1: Add `EUROPEAN_REFERRAL` to ServiceType enum**

Open `prisma/schema.prisma` line 51 and change:
```prisma
enum ServiceType {
  SPECIALIST_OPINION
  RESULT_INTERPRETATION
  FOLLOW_UP
  TREND_ANALYSIS
  EUROPEAN_REFERRAL
}
```

- [ ] **Step 2: Add `ConsultationType` enum after `DeletionStatus` enum**

```prisma
enum ConsultationType {
  IN_PERSON
  VIRTUAL
}
```

- [ ] **Step 3: Add `ReferralStatus` enum after `ConsultationType`**

```prisma
enum ReferralStatus {
  SEARCHING
  MATCHED
  SCHEDULED
  COMPLETED
  CLOSED
}
```

- [ ] **Step 4: Add `ReferralCoordination` model after `CaseRecord` model**

```prisma
model ReferralCoordination {
  id               String             @id @default(cuid())
  caseId           String             @unique
  referralStatus   ReferralStatus     @default(SEARCHING)
  specialistName   String?
  specialistEmail  String?
  clinic           String?
  country          String?
  consultationType ConsultationType?
  coordinatorNotes String?            @db.Text
  scheduledAt      DateTime?
  completedAt      DateTime?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  case             Case               @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 5: Add the relation to `Case` model (after `records` relation)**

In `prisma/schema.prisma`, add to the `Case` model:
```prisma
  referralCoordination ReferralCoordination?
```

- [ ] **Step 6: Run Prisma migration**

Run: `npx prisma migrate dev --name add_european_referral`

Expected: New migration file created under `prisma/migrations/`

- [ ] **Step 7: Regenerate Prisma client**

Run: `npx prisma generate`

Expected: `lib/generated/prisma/enums.ts` now includes `ConsultationType`, `ReferralStatus`, and `EUROPEAN_REFERRAL` in `ServiceType`. New model file created at `lib/generated/prisma/models/ReferralCoordination.ts`.

- [ ] **Step 8: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/ lib/generated/prisma/
git commit -m "feat: add ReferralCoordination model and EUROPEAN_REFERRAL service type"
```

---

### Task 2: Update validation schema and constants

**Files:**
- Modify: `lib/schemas/case.schema.ts:4`
- Modify: `lib/constants.ts:10-15`

- [ ] **Step 1: Add `EUROPEAN_REFERRAL` to Zod enum**

In `lib/schemas/case.schema.ts`, change the enum line to:
```typescript
  serviceType: z.enum(['SPECIALIST_OPINION', 'RESULT_INTERPRETATION', 'FOLLOW_UP', 'TREND_ANALYSIS', 'EUROPEAN_REFERRAL'], {
```

- [ ] **Step 2: Add label to `SERVICE_TYPE_LABELS`**

In `lib/constants.ts`, add to the `SERVICE_TYPE_LABELS` record:
```typescript
  EUROPEAN_REFERRAL: 'European Specialist Referral',
```

- [ ] **Step 3: Add `REFERRAL_STATUS_CONFIG` to `lib/constants.ts`**

Add after `DELETION_STATUS_CONFIG`:
```typescript
export const REFERRAL_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SEARCHING: { label: 'Searching', color: 'bg-blue-50 text-blue-600' },
  MATCHED: { label: 'Matched', color: 'bg-green-50 text-green-600' },
  SCHEDULED: { label: 'Scheduled', color: 'bg-purple-50 text-purple-600' },
  COMPLETED: { label: 'Completed', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/schemas/case.schema.ts lib/constants.ts
git commit -m "feat: update validation and constants for European referral service"
```

---

### Task 3: Update GET endpoints to include referralCoordination

**Files:**
- Modify: `app/api/cases/route.ts:18-25` (patient include)
- Modify: `app/api/cases/[id]/route.ts:19-36` (detail include)
- Modify: `app/api/admin/cases/route.ts:14-18` (admin include)

- [ ] **Step 1: Add `referralCoordination` to patient cases list include**

In `app/api/cases/route.ts`, add to the patient query's `include` block (after `aiPrescreens`):
```typescript
          referralCoordination: true,
```

Final include block should look like:
```typescript
      include: {
        records: true,
        opinions: {
          include: { specialist: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        aiPrescreens: { take: 1 },
        referralCoordination: true,
      },
```

- [ ] **Step 2: Add `referralCoordination` to doctor cases list include**

In the same file, add to the doctor query's `include` block:
```typescript
          referralCoordination: true,
```

- [ ] **Step 3: Add `referralCoordination` to case detail view**

In `app/api/cases/[id]/route.ts`, add to the `include` block:
```typescript
      referralCoordination: true,
```

- [ ] **Step 4: Add `referralCoordination` to admin cases list**

In `app/api/admin/cases/route.ts`, add to the `include` block:
```typescript
      referralCoordination: true,
```

- [ ] **Step 5: Commit**

```bash
git add app/api/cases/route.ts app/api/cases/[id]/route.ts app/api/admin/cases/route.ts
git commit -m "feat: include referralCoordination in case API responses"
```

---

### Task 4: Create referral coordination API endpoints

**Files:**
- Create: `app/api/referrals/[caseId]/route.ts`

- [ ] **Step 1: Create directory and file**

Run: `mkdir -p app/api/referrals/\[caseId\]`

Create `app/api/referrals/[caseId]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const updateReferralSchema = z.object({
  referralStatus: z.enum(['SEARCHING', 'MATCHED', 'SCHEDULED', 'COMPLETED', 'CLOSED']).optional(),
  specialistName: z.string().optional(),
  specialistEmail: z.string().email().optional().or(z.literal('')),
  clinic: z.string().optional(),
  country: z.string().optional(),
  consultationType: z.enum(['IN_PERSON', 'VIRTUAL']).optional(),
  coordinatorNotes: z.string().optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { caseId } = await params;
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { patientId: true, serviceType: true },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (caseRecord.serviceType !== 'EUROPEAN_REFERRAL') {
    return NextResponse.json({ error: 'Not a referral case' }, { status: 400 });
  }

  if (role === 'PATIENT' && caseRecord.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const coordination = await prisma.referralCoordination.findUnique({
    where: { caseId },
  });

  if (!coordination) {
    return NextResponse.json({ error: 'Referral coordination not found' }, { status: 404 });
  }

  return NextResponse.json(coordination, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { caseId } = await params;
  const body = await request.json();
  const parsed = updateReferralSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { serviceType: true },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (caseRecord.serviceType !== 'EUROPEAN_REFERRAL') {
    return NextResponse.json({ error: 'Not a referral case' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.referralStatus !== undefined) data.referralStatus = parsed.data.referralStatus;
  if (parsed.data.specialistName !== undefined) data.specialistName = parsed.data.specialistName;
  if (parsed.data.specialistEmail !== undefined) data.specialistEmail = parsed.data.specialistEmail || null;
  if (parsed.data.clinic !== undefined) data.clinic = parsed.data.clinic;
  if (parsed.data.country !== undefined) data.country = parsed.data.country;
  if (parsed.data.consultationType !== undefined) data.consultationType = parsed.data.consultationType;
  if (parsed.data.coordinatorNotes !== undefined) data.coordinatorNotes = parsed.data.coordinatorNotes;
  if (parsed.data.scheduledAt !== undefined) data.scheduledAt = parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null;
  if (parsed.data.referralStatus === 'COMPLETED') data.completedAt = new Date();

  const coordination = await prisma.referralCoordination.upsert({
    where: { caseId },
    create: { caseId, ...data },
    update: data,
  });

  return NextResponse.json(coordination, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
```

- [ ] **Step 2: Check the PATCH handles case.status transitions**

Verify that when `referralStatus` goes to `CLOSED`, the admin also updates `Case.status` separately (via existing admin case update). No automatic sync needed — admin explicitly manages both.

- [ ] **Step 3: Commit**

```bash
git add app/api/referrals/
git commit -m "feat: add referral coordination GET and PATCH endpoints"
```

---

### Task 5: Update record upload to skip AI pre-screening for referral cases

**Files:**
- Modify: `app/api/cases/[id]/records/route.ts:92-102`

- [ ] **Step 1: Add condition to skip AI pre-screening**

In `app/api/cases/[id]/records/route.ts`, change lines 92-102 from:
```typescript
  // After successful file upload, trigger AI pre-screening (fire and forget)
  // Only trigger if this is the first record for the case
  const recordCount = await prisma.caseRecord.count({ where: { caseId: id } });
  if (recordCount === 1) {
    fetch(`${process.env.NEXTAUTH_URL}/api/ai/prescreen/${id}`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
      },
    }).catch((err) => console.error("Pre-screening trigger failed:", err));
  }
```

To:
```typescript
  // After successful file upload, trigger AI pre-screening (fire and forget)
  // Only trigger for opinion-style cases, not referrals
  if (caseRecord.serviceType !== 'EUROPEAN_REFERRAL') {
    const recordCount = await prisma.caseRecord.count({ where: { caseId: id } });
    if (recordCount === 1) {
      fetch(`${process.env.NEXTAUTH_URL}/api/ai/prescreen/${id}`, {
        method: "POST",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
        },
      }).catch((err) => console.error("Pre-screening trigger failed:", err));
    }
  }
```

- [ ] **Step 2: Commit**

```bash
git add app/api/cases/[id]/records/route.ts
git commit -m "fix: skip AI pre-screening trigger for referral cases"
```

---

### Task 6: Ensure ReferralCoordination is auto-created on case creation

**Files:**
- Modify: `app/api/cases/route.ts` (POST handler)

- [ ] **Step 1: Add ReferralCoordination creation when serviceType is EUROPEAN_REFERRAL**

In `app/api/cases/route.ts`, change the `POST` handler's `prisma.case.create` to use nested create:

```typescript
  const caseRecord = await prisma.case.create({
    data: {
      patientId: userId,
      serviceType: parsed.data.serviceType,
      description: parsed.data.description,
      status: 'OPEN',
      ...(parsed.data.serviceType === 'EUROPEAN_REFERRAL' && {
        referralCoordination: {
          create: { referralStatus: 'SEARCHING' },
        },
      }),
    },
    include: {
      referralCoordination: true,
    },
  });
```

- [ ] **Step 2: Commit**

```bash
git add app/api/cases/route.ts
git commit -m "feat: auto-create ReferralCoordination on referral case creation"
```

---

### Task 7: Update existing test mocks

**Files:**
- Modify: `__tests__/e2e/phase1-happy-path.test.ts:60-76`

- [ ] **Step 1: Add `EUROPEAN_REFERRAL` to mocked ServiceType**

In `__tests__/e2e/phase1-happy-path.test.ts`, update the mock around line 70-75:
```typescript
  ServiceType: {
    SPECIALIST_OPINION: 'SPECIALIST_OPINION',
    RESULT_INTERPRETATION: 'RESULT_INTERPRETATION',
    FOLLOW_UP: 'FOLLOW_UP',
    TREND_ANALYSIS: 'TREND_ANALYSIS',
    EUROPEAN_REFERRAL: 'EUROPEAN_REFERRAL',
  },
```

- [ ] **Step 2: Run existing tests to confirm no regression**

Run: `npx vitest run __tests__/e2e/phase1-happy-path.test.ts`
Expected: All existing tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/e2e/phase1-happy-path.test.ts
git commit -m "test: add EUROPEAN_REFERRAL to e2e mocks"
```

---

### Task 8: Write E2E tests for referral workflow

**Files:**
- Create: `__tests__/e2e/referral-workflow.test.ts`

- [ ] **Step 1: Create the test file**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    case: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    caseRecord: {
      count: vi.fn(),
    },
    referralCoordination: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('@/lib/generated/prisma/enums', () => ({
  ServiceType: {
    SPECIALIST_OPINION: 'SPECIALIST_OPINION',
    RESULT_INTERPRETATION: 'RESULT_INTERPRETATION',
    FOLLOW_UP: 'FOLLOW_UP',
    TREND_ANALYSIS: 'TREND_ANALYSIS',
    EUROPEAN_REFERRAL: 'EUROPEAN_REFERRAL',
  },
  CaseStatus: {
    OPEN: 'OPEN',
    UNDER_REVIEW: 'UNDER_REVIEW',
    CLOSED: 'CLOSED',
    DISPUTED: 'DISPUTED',
  },
  ReferralStatus: {
    SEARCHING: 'SEARCHING',
    MATCHED: 'MATCHED',
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    CLOSED: 'CLOSED',
  },
  ConsultationType: {
    IN_PERSON: 'IN_PERSON',
    VIRTUAL: 'VIRTUAL',
  },
}));

vi.mock('fs/promises', async () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { POST as createCase } from '@/app/api/cases/route';
import { GET as getReferral, PATCH as updateReferral } from '@/app/api/referrals/[caseId]/route';

function mockSession(role: string, id = 'user-1') {
  (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
    user: { id, role, name: 'Test User', email: 'test@example.com' },
  });
}

function createRequest(overrides: Record<string, unknown> = {}) {
  return {
    json: () => Promise.resolve({
      serviceType: 'EUROPEAN_REFERRAL',
      description: 'Need to find a cardiologist in Germany for follow-up after heart surgery.',
      ...overrides,
    }),
  } as Request;
}

function paramsRequest(caseId: string) {
  return { params: Promise.resolve({ caseId }) } as unknown as Request;
}

describe('European Referral Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('patient can create a referral case', async () => {
    mockSession('PATIENT');
    (prisma.case.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'case-1',
      patientId: 'user-1',
      serviceType: 'EUROPEAN_REFERRAL',
      status: 'OPEN',
      description: 'Need to find a cardiologist in Germany...',
      referralCoordination: { referralStatus: 'SEARCHING' },
    });

    const res = await createCase(createRequest());
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.serviceType).toBe('EUROPEAN_REFERRAL');
    expect(prisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          serviceType: 'EUROPEAN_REFERRAL',
          referralCoordination: expect.objectContaining({
            create: { referralStatus: 'SEARCHING' },
          }),
        }),
      })
    );
  });

  it('admin can update referral coordination', async () => {
    mockSession('ADMIN');
    (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      serviceType: 'EUROPEAN_REFERRAL',
    });
    (prisma.referralCoordination.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({
      caseId: 'case-1',
      referralStatus: 'MATCHED',
      specialistName: 'Dr. Mueller',
      clinic: 'Charité Berlin',
      country: 'Germany',
    });

    const req = {
      json: () => Promise.resolve({
        referralStatus: 'MATCHED',
        specialistName: 'Dr. Mueller',
        clinic: 'Charité Berlin',
        country: 'Germany',
      }),
    } as Request;

    const res = await updateReferral(req, { params: Promise.resolve({ caseId: 'case-1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.referralStatus).toBe('MATCHED');
    expect(data.specialistName).toBe('Dr. Mueller');
  });

  it('patient gets 403 when updating referral', async () => {
    mockSession('PATIENT');

    const req = {
      json: () => Promise.resolve({ referralStatus: 'MATCHED' }),
    } as Request;

    const res = await updateReferral(req, { params: Promise.resolve({ caseId: 'case-1' }) });
    expect(res.status).toBe(403);
  });

  it('patient can view their own referral', async () => {
    mockSession('PATIENT');
    (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      patientId: 'user-1',
      serviceType: 'EUROPEAN_REFERRAL',
    });
    (prisma.referralCoordination.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      caseId: 'case-1',
      referralStatus: 'MATCHED',
      specialistName: 'Dr. Mueller',
    });

    const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.specialistName).toBe('Dr. Mueller');
  });

  it('patient cannot view another patient referral', async () => {
    mockSession('PATIENT');
    (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      patientId: 'user-2',
      serviceType: 'EUROPEAN_REFERRAL',
    });

    const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
    expect(res.status).toBe(403);
  });

  it('returns 400 for non-referral case', async () => {
    mockSession('ADMIN');
    (prisma.case.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      patientId: 'user-1',
      serviceType: 'SPECIALIST_OPINION',
    });

    const res = await getReferral({} as Request, { params: Promise.resolve({ caseId: 'case-1' }) });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Not a referral case');
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run __tests__/e2e/referral-workflow.test.ts`
Expected: All 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add __tests__/e2e/referral-workflow.test.ts
git commit -m "test: add E2E tests for European referral workflow"
```

---

### Task 9: Run full test suite and final verification

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (no regressions in existing tests, new tests pass).

- [ ] **Step 2: Run TypeScript type check**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final fixes after test and type verification"
```
