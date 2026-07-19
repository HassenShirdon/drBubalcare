# Phase 5: Compliance & Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement audit logging, dispute resolution, GDPR compliance, and edge case automation for the Dr. Bubal Care platform.

**Architecture:** Modular approach — shared foundation (audit logger + notification service) built first, then four independent modules. Each module is testable independently.

**Tech Stack:** Next.js 15, Prisma, PostgreSQL, Vitest, Zod, React, shadcn/ui, @tanstack/react-query

## Global Constraints

- Next.js 15 App Router patterns (route.ts files)
- Prisma Client imported from `@/lib/generated/prisma/client`
- Prisma instance from `@/lib/db` (`prisma`)
- Session via `next-auth` `getServerSession(authOptions)` from `@/lib/auth`
- Zod schemas in `lib/schemas/`
- Tests in `__tests__/unit/` or `__tests__/integration/`
- UI components from `@/components/ui/` (shadcn)
- Data tables use `DataTable` component with column defs
- Admin pages use `"use client"` with `@tanstack/react-query`
- Constants in `lib/constants.ts`

---

## File Structure

### Shared Foundation
| File | Purpose |
|------|---------|
| `lib/audit/logger.ts` | Core audit logging function |
| `lib/audit/types.ts` | Audit event type definitions |
| `lib/notifications/service.ts` | Admin alert + patient notification |
| `lib/notifications/types.ts` | Notification type definitions |
| `__tests__/unit/audit/logger.test.ts` | Audit logger unit tests |
| `__tests__/unit/notifications/service.test.ts` | Notification service unit tests |

### Schema Changes
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Add `before`/`after` to AuditLog, add Dispute, ConsentRecord, DataDeletionRequest models |

### Audit Logging
| File | Purpose |
|------|---------|
| `app/api/admin/audit-logs/route.ts` | GET logs with pagination/filters |
| `app/admin/audit-logs/page.tsx` | Admin audit logs page |
| `app/admin/audit-logs/columns.tsx` | Table column definitions |
| `__tests__/integration/audit-logs.test.ts` | Integration tests |

### Edge Case Automation
| File | Purpose |
|------|---------|
| `lib/edge-cases/service.ts` | Edge case detection + routing logic |
| `lib/edge-cases/types.ts` | Edge case type definitions |
| `app/api/admin/edge-cases/pending/route.ts` | GET pending edge cases |
| `app/api/admin/edge-cases/urgent-alert/route.ts` | POST manual urgent alert |
| `app/api/cases/[id]/flag-incomplete/route.ts` | POST flag incomplete upload |
| `app/api/cron/check-no-specialist/route.ts` | Cron: detect unmatched cases |
| `app/admin/edge-cases/page.tsx` | Admin edge cases dashboard |
| `__tests__/integration/edge-cases.test.ts` | Integration tests |

### Dispute Resolution
| File | Purpose |
|------|---------|
| `lib/disputes/service.ts` | Dispute workflow logic |
| `lib/disputes/types.ts` | Dispute type definitions |
| `lib/schemas/dispute.schema.ts` | Zod validation schemas |
| `app/api/cases/[id]/disputes/route.ts` | POST file dispute |
| `app/api/admin/disputes/route.ts` | GET all disputes |
| `app/api/admin/disputes/[id]/route.ts` | GET dispute detail |
| `app/api/admin/disputes/[id]/triage/route.ts` | POST triage |
| `app/api/admin/disputes/[id]/peer-review-candidates/route.ts` | GET candidates |
| `app/api/admin/disputes/[id]/assign-peer-review/route.ts` | POST assign |
| `app/api/admin/disputes/[id]/resolve/route.ts` | POST resolve |
| `app/patient/cases/[id]/dispute/page.tsx` | File dispute form |
| `app/admin/disputes/page.tsx` | Dispute list |
| `app/admin/disputes/[id]/page.tsx` | Dispute detail |
| `app/admin/disputes/columns.tsx` | Table columns |
| `__tests__/integration/disputes.test.ts` | Integration tests |

### GDPR Compliance
| File | Purpose |
|------|---------|
| `lib/gdpr/service.ts` | GDPR logic (consent, export, deletion) |
| `lib/gdpr/types.ts` | GDPR type definitions |
| `lib/gdpr/pdf-generator.ts` | PDF data export generator |
| `lib/schemas/gdpr.schema.ts` | Zod validation schemas |
| `app/api/patient/consent/route.ts` | GET/POST consent |
| `app/api/patient/data-export/route.ts` | POST request export |
| `app/api/patient/data-export/download/route.ts` | GET download PDF |
| `app/api/patient/data-deletion/route.ts` | POST request deletion |
| `app/api/patient/data-deletion/confirm/route.ts` | POST confirm |
| `app/api/patient/data-deletion/cancel/route.ts` | POST cancel |
| `app/api/admin/data-requests/route.ts` | GET data requests |
| `app/patient/settings/privacy/page.tsx` | Privacy settings |
| `app/admin/data-requests/page.tsx` | Admin data requests |
| `app/admin/data-requests/columns.tsx` | Table columns |
| `__tests__/integration/gdpr.test.ts` | Integration tests |

---

### Task 1: Database Schema Update

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: Updated Prisma schema with `before`/`after` on AuditLog, new Dispute/ConsentRecord/DataDeletionRequest models

- [ ] **Step 1: Add `before` and `after` fields to AuditLog model**

```prisma
model AuditLog {
  id           String   @id @default(cuid())
  userId       String
  action       String
  resourceType String
  resourceId   String
  before       Json?
  after        Json?
  metadata     Json?
  timestamp    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 2: Add DisputeStatus enum and Dispute model**

```prisma
enum DisputeStatus {
  PENDING
  UNDER_REVIEW
  PEER_REVIEW_ASSIGNED
  RESOLVED
  DISMISSED
}

model Dispute {
  id              String   @id @default(cuid())
  caseId          String
  patientId       String
  opinionId       String
  reason          String   @db.Text
  status          DisputeStatus @default(PENDING)
  adminNotes      String?  @db.Text
  resolution      String?  @db.Text
  peerReviewOpinionId String?
  createdAt       DateTime @default(now())
  resolvedAt      DateTime?

  case            Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  patient         User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
  opinion         SpecialistOpinion @relation(fields: [opinionId], references: [id], onDelete: Cascade)
  peerReviewOpinion SpecialistOpinion? @relation(fields: [peerReviewOpinionId], references: [id], onDelete: SetNull)
}
```

- [ ] **Step 3: Add ConsentRecord model**

```prisma
model ConsentRecord {
  id          String   @id @default(cuid())
  patientId   String
  consentType String
  granted     Boolean
  grantedAt   DateTime?
  revokedAt   DateTime?

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@unique([patientId, consentType])
}
```

- [ ] **Step 4: Add DeletionStatus enum and DataDeletionRequest model**

```prisma
enum DeletionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model DataDeletionRequest {
  id          String   @id @default(cuid())
  patientId   String
  status      DeletionStatus @default(PENDING)
  requestedAt DateTime
  executeAt   DateTime
  completedAt DateTime?

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 5: Add relations to existing models**

Add to `Case` model:
```prisma
  disputes     Dispute[]
```

Add to `User` model:
```prisma
  disputes         Dispute[]
  consentRecords   ConsentRecord[]
  deletionRequests DataDeletionRequest[]
```

Add to `SpecialistOpinion` model:
```prisma
  dispute          Dispute?           @relation("DisputeOpinion")
  peerReviewFor    Dispute?           @relation("PeerReviewOpinion")
```

Update `Dispute` model relations to match:
```prisma
  opinion         SpecialistOpinion @relation("DisputeOpinion", fields: [opinionId], references: [id], onDelete: Cascade)
  peerReviewOpinion SpecialistOpinion? @relation("PeerReviewOpinion", fields: [peerReviewOpinionId], references: [id], onDelete: SetNull)
```

- [ ] **Step 6: Run Prisma generate**

Run: `npx prisma generate`
Expected: Client generated successfully

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add Phase 5 models - AuditLog fields, Dispute, ConsentRecord, DataDeletionRequest"
```

---

### Task 2: Audit Logger Utility

**Files:**
- Create: `lib/audit/types.ts`
- Create: `lib/audit/logger.ts`
- Create: `__tests__/unit/audit/logger.test.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db`
- Produces: `logAuditEvent(params: LogAuditEventParams)`, `AuditEventAction` enum

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/unit/audit/logger.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { prisma } from '@/lib/db';

describe('Audit Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an audit log entry with required fields', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await logAuditEvent({
      userId: 'user-1',
      action: AUDIT_ACTIONS.CASE_CREATE,
      resourceType: 'Case',
      resourceId: 'case-1',
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        action: 'CASE_CREATE',
        resourceType: 'Case',
        resourceId: 'case-1',
        before: null,
        after: null,
        metadata: null,
      },
    });
  });

  it('includes before/after state when provided', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await logAuditEvent({
      userId: 'user-1',
      action: AUDIT_ACTIONS.CASE_STATUS_CHANGE,
      resourceType: 'Case',
      resourceId: 'case-1',
      before: { status: 'OPEN' },
      after: { status: 'UNDER_REVIEW' },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        before: { status: 'OPEN' },
        after: { status: 'UNDER_REVIEW' },
      }),
    });
  });

  it('includes metadata when provided', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await logAuditEvent({
      userId: 'user-1',
      action: AUDIT_ACTIONS.LOGIN,
      resourceType: 'User',
      resourceId: 'user-1',
      metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
      }),
    });
  });

  it('logs error but does not throw when prisma fails', async () => {
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error('DB error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      logAuditEvent({
        userId: 'user-1',
        action: AUDIT_ACTIONS.LOGIN,
        resourceType: 'User',
        resourceId: 'user-1',
      })
    ).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/audit/logger.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write types**

```typescript
// lib/audit/types.ts
export interface LogAuditEventParams {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}
```

- [ ] **Step 4: Write audit logger implementation**

```typescript
// lib/audit/logger.ts
import { prisma } from '@/lib/db';
import type { LogAuditEventParams } from './types';

export const AUDIT_ACTIONS = {
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',

  // Cases
  CASE_CREATE: 'CASE_CREATE',
  CASE_STATUS_CHANGE: 'CASE_STATUS_CHANGE',
  CASE_ASSIGN_SPECIALIST: 'CASE_ASSIGN_SPECIALIST',
  DISPUTE_FILED: 'DISPUTE_FILED',
  DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',

  // Opinions
  OPINION_DRAFT_CREATED: 'OPINION_DRAFT_CREATED',
  OPINION_SIGNED: 'OPINION_SIGNED',
  OPINION_DELIVERED: 'OPINION_DELIVERED',

  // AI Operations
  AI_PRESCREEN_GENERATED: 'AI_PRESCREEN_GENERATED',
  AI_SYNTHESIS_GENERATED: 'AI_SYNTHESIS_GENERATED',
  AI_SUMMARY_GENERATED: 'AI_SUMMARY_GENERATED',

  // File Access
  RECORD_UPLOADED: 'RECORD_UPLOADED',
  RECORD_ACCESSED: 'RECORD_ACCESSED',
  RECORD_DELETED: 'RECORD_DELETED',

  // Admin
  SPECIALIST_VERIFIED: 'SPECIALIST_VERIFIED',
  CASE_OVERRIDE: 'CASE_OVERRIDE',
  PEER_REVIEW_ASSIGNED: 'PEER_REVIEW_ASSIGNED',

  // Data
  DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
  CONSENT_GIVEN: 'CONSENT_GIVEN',
  CONSENT_REVOKED: 'CONSENT_REVOKED',
} as const;

export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        before: params.before ?? null,
        after: params.after ?? null,
        metadata: params.metadata ?? null,
      },
    });
  } catch (error) {
    console.error('[AuditLogger] Failed to create audit log entry:', error);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/audit/logger.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/audit/ __tests__/unit/audit/
git commit -m "feat(audit): add audit logger utility with before/after state tracking"
```

---

### Task 3: Notification Service

**Files:**
- Create: `lib/notifications/types.ts`
- Create: `lib/notifications/service.ts`
- Create: `__tests__/unit/notifications/service.test.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db`
- Produces: `notifyAdmin(params)`, `notifyPatient(params)`, `NOTIFICATION_TYPES`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/unit/notifications/service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { notifyAdmin, notifyPatient, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import { prisma } from '@/lib/db';

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('notifyAdmin creates an audit log entry for admin alert', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await notifyAdmin({
      type: NOTIFICATION_TYPES.URGENT_FINDING,
      message: 'Critical finding in case case-1',
      metadata: { caseId: 'case-1' },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'ADMIN_ALERT',
        resourceType: 'Notification',
        resourceId: 'ADMIN_URGENT_FINDING',
        metadata: expect.objectContaining({
          type: 'URGENT_FINDING',
          message: 'Critical finding in case case-1',
          caseId: 'case-1',
        }),
      }),
    });
  });

  it('notifyPatient creates an audit log entry for patient notification', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await notifyPatient({
      patientId: 'patient-1',
      type: NOTIFICATION_TYPES.INCOMPLETE_UPLOAD,
      message: 'Please upload missing documents',
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'patient-1',
        action: 'PATIENT_NOTIFICATION',
        resourceType: 'Notification',
        resourceId: 'PATIENT_INCOMPLETE_UPLOAD',
        metadata: expect.objectContaining({
          type: 'INCOMPLETE_UPLOAD',
          message: 'Please upload missing documents',
        }),
      }),
    });
  });

  it('logs error but does not throw when prisma fails', async () => {
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error('DB error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      notifyAdmin({
        type: NOTIFICATION_TYPES.URGENT_FINDING,
        message: 'Test',
      })
    ).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/notifications/service.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write types**

```typescript
// lib/notifications/types.ts
export interface NotifyAdminParams {
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotifyPatientParams {
  patientId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
}
```

- [ ] **Step 4: Write notification service implementation**

```typescript
// lib/notifications/service.ts
import { prisma } from '@/lib/db';
import type { NotifyAdminParams, NotifyPatientParams } from './types';

export const NOTIFICATION_TYPES = {
  URGENT_FINDING: 'URGENT_FINDING',
  DISPUTE_FILED: 'DISPUTE_FILED',
  DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
  NO_SPECIALIST_MATCHED: 'NO_SPECIALIST_MATCHED',
  INCOMPLETE_UPLOAD: 'INCOMPLETE_UPLOAD',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

const ADMIN_USER_ID = 'system-admin';

export async function notifyAdmin(params: NotifyAdminParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: ADMIN_USER_ID,
        action: 'ADMIN_ALERT',
        resourceType: 'Notification',
        resourceId: `ADMIN_${params.type}`,
        metadata: {
          type: params.type,
          message: params.message,
          ...params.metadata,
        },
      },
    });
  } catch (error) {
    console.error('[NotificationService] Failed to create admin alert:', error);
  }
}

export async function notifyPatient(params: NotifyPatientParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.patientId,
        action: 'PATIENT_NOTIFICATION',
        resourceType: 'Notification',
        resourceId: `PATIENT_${params.type}`,
        metadata: {
          type: params.type,
          message: params.message,
          ...params.metadata,
        },
      },
    });
  } catch (error) {
    console.error('[NotificationService] Failed to create patient notification:', error);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/notifications/service.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/notifications/ __tests__/unit/notifications/
git commit -m "feat(notifications): add notification service for admin alerts and patient notifications"
```

---

### Task 4: Audit Logs API Route

**Files:**
- Create: `app/api/admin/audit-logs/route.ts`
- Create: `__tests__/integration/audit-logs.test.ts`

**Interfaces:**
- Consumes: `logAuditEvent` from `@/lib/audit/logger`, `prisma` from `@/lib/db`, `getServerSession` from `next-auth`
- Produces: `GET /api/admin/audit-logs` — paginated logs with filters

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/integration/audit-logs.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    auditLog: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { GET } from '@/app/api/admin/audit-logs/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('Audit Logs API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await GET(new Request('http://localhost?limit=10&offset=0'));
    expect(res.status).toBe(401);
  });

  it('returns 403 for non-admin users', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const res = await GET(new Request('http://localhost?limit=10&offset=0'));
    expect(res.status).toBe(403);
  });

  it('returns paginated audit logs for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);
    vi.mocked(prisma.auditLog.count).mockResolvedValue(0);

    const res = await GET(new Request('http://localhost?limit=10&offset=0'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('logs');
    expect(body).toHaveProperty('total');
  });

  it('filters by action', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(prisma.auditLog.findMany).mockResolvedValue([]);
    vi.mocked(prisma.auditLog.count).mockResolvedValue(0);

    const res = await GET(new Request('http://localhost?limit=10&offset=0&action=LOGIN'));
    expect(res.status).toBe(200);
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ action: 'LOGIN' }),
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/integration/audit-logs.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write API route**

```typescript
// app/api/admin/audit-logs/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const action = searchParams.get('action') ?? undefined;
  const resourceType = searchParams.get('resourceType') ?? undefined;
  const userId = searchParams.get('userId') ?? undefined;
  const startDate = searchParams.get('startDate') ?? undefined;
  const endDate = searchParams.get('endDate') ?? undefined;

  const where: Record<string, unknown> = {};
  if (action) where.action = action;
  if (resourceType) where.resourceType = resourceType;
  if (userId) where.userId = userId;
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) (where.timestamp as Record<string, Date>).gte = new Date(startDate);
    if (endDate) (where.timestamp as Record<string, Date>).lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total }, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/integration/audit-logs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/audit-logs/ __tests__/integration/audit-logs.test.ts
git commit -m "feat(audit): add admin audit logs API with pagination and filters"
```

---

### Task 5: Audit Logs Admin Page

**Files:**
- Create: `app/admin/audit-logs/columns.tsx`
- Create: `app/admin/audit-logs/page.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/audit-logs`, `AUDIT_ACTIONS` from `@/lib/audit/logger`

- [ ] **Step 1: Create columns definition**

```typescript
// app/admin/audit-logs/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type AuditLogEntry = {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  timestamp: string
  user: { name: string | null; email: string }
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    LOGIN: 'bg-blue-50 text-blue-600',
    LOGOUT: 'bg-gray-100 text-gray-500',
    REGISTER: 'bg-green-50 text-green-600',
    CASE_CREATE: 'bg-purple-50 text-purple-600',
    CASE_STATUS_CHANGE: 'bg-amber-50 text-amber-600',
    DISPUTE_FILED: 'bg-red-50 text-red-600',
    DISPUTE_RESOLVED: 'bg-healing-teal/10 text-healing-teal',
    OPINION_SIGNED: 'bg-healing-teal/10 text-healing-teal',
    DATA_EXPORT_REQUESTED: 'bg-orange-50 text-orange-600',
    DATA_DELETION_REQUESTED: 'bg-red-50 text-red-600',
  }
  const color = colors[action] ?? 'bg-gray-100 text-gray-500'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {action.replace(/_/g, ' ')}
    </span>
  )
}

export const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.timestamp).toLocaleString("en-US", {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-text-medical-black">{row.original.user.name ?? "System"}</p>
        <p className="text-xs text-on-surface-variant">{row.original.user.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <ActionBadge action={row.original.action} />,
  },
  {
    accessorKey: "resourceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resource" />,
    cell: ({ row }) => (
      <span className="text-sm text-text-medical-black">
        {row.original.resourceType}: {row.original.resourceId}
      </span>
    ),
  },
  {
    accessorKey: "metadata",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    cell: ({ row }) => {
      const meta = row.original.metadata
      if (!meta) return <span className="text-xs text-on-surface-variant">—</span>
      return (
        <span className="text-xs text-on-surface-variant truncate max-w-[200px] block">
          {JSON.stringify(meta)}
        </span>
      )
    },
  },
]
```

- [ ] **Step 2: Create admin page**

```typescript
// app/admin/audit-logs/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type AuditLogEntry } from "./columns"

export default function AdminAuditLogsPage() {
  const { data, isLoading } = useQuery<{ logs: AuditLogEntry[]; total: number }>({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit-logs?limit=100&offset=0")
      if (!res.ok) throw new Error("Failed to fetch audit logs")
      return res.json()
    },
    staleTime: 30 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Audit Logs</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          {data?.total ?? 0} total entries
        </p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={data?.logs ?? []}
          searchKey="user"
          searchPlaceholder="Search by user name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/audit-logs/
git commit -m "feat(audit): add admin audit logs page with data table"
```

---

### Task 6: Edge Case Types and Service

**Files:**
- Create: `lib/edge-cases/types.ts`
- Create: `lib/edge-cases/service.ts`
- Create: `__tests__/unit/edge-cases/service.test.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db`, `notifyAdmin`/`notifyPatient` from `@/lib/notifications/service`
- Produces: `checkUnmatchedCases()`, `checkUrgentFindings()`, `findBackupSpecialist()`, `EdgeCaseType`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/unit/edge-cases/service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    case: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    specialistOpinion: {
      findUnique: vi.fn(),
    },
    doctor: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/notifications/service', () => ({
  notifyAdmin: vi.fn(),
  notifyPatient: vi.fn(),
  NOTIFICATION_TYPES: {
    NO_SPECIALIST_MATCHED: 'NO_SPECIALIST_MATCHED',
    URGENT_FINDING: 'URGENT_FINDING',
    INCOMPLETE_UPLOAD: 'INCOMPLETE_UPLOAD',
  },
}));

import { checkUnmatchedCases, findBackupSpecialist } from '@/lib/edge-cases/service';
import { prisma } from '@/lib/db';
import { notifyAdmin, notifyPatient } from '@/lib/notifications/service';

describe('Edge Case Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checkUnmatchedCases alerts for cases open > 4 hours', async () => {
    vi.mocked(prisma.case.findMany).mockResolvedValue([
      { id: 'case-1', patientId: 'patient-1', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    ] as any);
    vi.mocked(notifyAdmin).mockResolvedValue();
    vi.mocked(notifyPatient).mockResolvedValue();

    await checkUnmatchedCases();

    expect(notifyAdmin).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'NO_SPECIALIST_MATCHED' })
    );
    expect(notifyPatient).toHaveBeenCalledWith(
      expect.objectContaining({ patientId: 'patient-1' })
    );
  });

  it('checkUnmatchedCases does not alert for recent cases', async () => {
    vi.mocked(prisma.case.findMany).mockResolvedValue([]);

    await checkUnmatchedCases();

    expect(notifyAdmin).not.toHaveBeenCalled();
  });

  it('findBackupSpecialist returns next available specialist', async () => {
    vi.mocked(prisma.doctor.findMany).mockResolvedValue([
      { userId: 'doc-2', specialty: 'Pathology', verified: true },
    ] as any);

    const result = await findBackupSpecialist('Pathology', 'doc-1');
    expect(result).toBe('doc-2');
  });

  it('findBackupSpecialist returns null when no backup available', async () => {
    vi.mocked(prisma.doctor.findMany).mockResolvedValue([]);

    const result = await findBackupSpecialist('Pathology', 'doc-1');
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/edge-cases/service.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write types**

```typescript
// lib/edge-cases/types.ts
export enum EdgeCaseType {
  NO_SPECIALIST_MATCHED = 'NO_SPECIALIST_MATCHED',
  URGENT_FINDING = 'URGENT_FINDING',
  INCOMPLETE_UPLOAD = 'INCOMPLETE_UPLOAD',
  SPECIALIST_UNAVAILABLE = 'SPECIALIST_UNAVAILABLE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export interface PendingEdgeCase {
  caseId: string;
  patientId: string;
  type: EdgeCaseType;
  createdAt: Date;
  details: string;
}
```

- [ ] **Step 4: Write service implementation**

```typescript
// lib/edge-cases/service.ts
import { prisma } from '@/lib/db';
import { notifyAdmin, notifyPatient, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import { EdgeCaseType } from './types';

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export async function checkUnmatchedCases(): Promise<void> {
  const cutoff = new Date(Date.now() - FOUR_HOURS_MS);

  const unmatchedCases = await prisma.case.findMany({
    where: {
      status: 'OPEN',
      specialistId: null,
      createdAt: { lt: cutoff },
    },
    select: { id: true, patientId: true, createdAt: true },
  });

  for (const c of unmatchedCases) {
    await notifyAdmin({
      type: NOTIFICATION_TYPES.NO_SPECIALIST_MATCHED,
      message: `Case ${c.id} has been open for over 4 hours without a specialist`,
      metadata: { caseId: c.id, patientId: c.patientId },
    });

    await notifyPatient({
      patientId: c.patientId,
      type: NOTIFICATION_TYPES.NO_SPECIALIST_MATCHED,
      message: 'We are working to assign a specialist to your case. You will be notified once assigned.',
      metadata: { caseId: c.id },
    });
  }
}

export async function findBackupSpecialist(
  specialty: string,
  excludeSpecialistId: string
): Promise<string | null> {
  const available = await prisma.doctor.findMany({
    where: {
      specialty,
      verified: true,
      userId: { not: excludeSpecialistId },
    },
    select: { userId: true },
    take: 1,
  });

  return available[0]?.userId ?? null;
}

export async function flagIncompleteUpload(
  caseId: string,
  specialistId: string,
  instructions: string
): Promise<void> {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { patientId: true },
  });

  if (!caseRecord) return;

  await notifyPatient({
    patientId: caseRecord.patientId,
    type: NOTIFICATION_TYPES.INCOMPLETE_UPLOAD,
    message: instructions,
    metadata: { caseId, flaggedBy: specialistId },
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/edge-cases/service.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/edge-cases/ __tests__/unit/edge-cases/
git commit -m "feat(edge-cases): add edge case detection service for unmatched cases and backup routing"
```

---

### Task 7: Edge Case Cron Job and API Routes

**Files:**
- Create: `app/api/cron/check-no-specialist/route.ts`
- Create: `app/api/admin/edge-cases/pending/route.ts`
- Create: `app/api/admin/edge-cases/urgent-alert/route.ts`
- Create: `app/api/cases/[id]/flag-incomplete/route.ts`
- Create: `__tests__/integration/edge-cases.test.ts`

**Interfaces:**
- Consumes: `checkUnmatchedCases` from `@/lib/edge-cases/service`, `notifyAdmin`/`notifyPatient` from `@/lib/notifications/service`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/integration/edge-cases.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('@/lib/edge-cases/service', () => ({
  checkUnmatchedCases: vi.fn(),
  flagIncompleteUpload: vi.fn(),
}));

vi.mock('@/lib/notifications/service', () => ({
  notifyAdmin: vi.fn(),
  NOTIFICATION_TYPES: { URGENT_FINDING: 'URGENT_FINDING' },
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    case: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { POST as cronPost } from '@/app/api/cron/check-no-specialist/route';
import { POST as flagPost } from '@/app/api/cases/[id]/flag-incomplete/route';
import { checkUnmatchedCases, flagIncompleteUpload } from '@/lib/edge-cases/service';
import { getServerSession } from 'next-auth';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('Edge Case Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cron: check-no-specialist', () => {
    it('calls checkUnmatchedCases', async () => {
      vi.mocked(checkUnmatchedCases).mockResolvedValue();
      const res = await cronPost(new Request('http://localhost', { method: 'POST' }));
      expect(res.status).toBe(200);
      expect(checkUnmatchedCases).toHaveBeenCalled();
    });
  });

  describe('Flag incomplete upload', () => {
    it('returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await flagPost(
        { json: async () => ({ instructions: 'Upload missing files' }) } as Request,
        { params: Promise.resolve({ id: 'case-1' }) }
      );
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const res = await flagPost(
        { json: async () => ({ instructions: 'Upload missing files' }) } as Request,
        { params: Promise.resolve({ id: 'case-1' }) }
      );
      expect(res.status).toBe(403);
    });

    it('calls flagIncompleteUpload for doctor', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
      vi.mocked(flagIncompleteUpload).mockResolvedValue();
      const res = await flagPost(
        { json: async () => ({ instructions: 'Upload missing files' }) } as Request,
        { params: Promise.resolve({ id: 'case-1' }) }
      );
      expect(res.status).toBe(200);
      expect(flagIncompleteUpload).toHaveBeenCalledWith('case-1', 'doc-1', 'Upload missing files');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/integration/edge-cases.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write cron route**

```typescript
// app/api/cron/check-no-specialist/route.ts
import { NextResponse } from 'next/server';
import { checkUnmatchedCases } from '@/lib/edge-cases/service';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await checkUnmatchedCases();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Cron] check-no-specialist failed:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Write pending edge cases route**

```typescript
// app/api/admin/edge-cases/pending/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const cutoff = new Date(Date.now() - FOUR_HOURS_MS);

  const unmatchedCases = await prisma.case.findMany({
    where: {
      status: 'OPEN',
      specialistId: null,
      createdAt: { lt: cutoff },
    },
    include: { patient: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ cases: unmatchedCases }, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
```

- [ ] **Step 5: Write urgent alert route**

```typescript
// app/api/admin/edge-cases/urgent-alert/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notifyAdmin, notifyPatient, NOTIFICATION_TYPES } from '@/lib/notifications/service';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { caseId, message } = await request.json();
  if (!caseId || !message) {
    return NextResponse.json({ error: 'caseId and message are required' }, { status: 400 });
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { patientId: true },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  await notifyAdmin({
    type: NOTIFICATION_TYPES.URGENT_FINDING,
    message,
    metadata: { caseId },
  });

  await notifyPatient({
    patientId: caseRecord.patientId,
    type: NOTIFICATION_TYPES.URGENT_FINDING,
    message: 'Your case has been flagged for urgent review. A specialist will contact you shortly.',
    metadata: { caseId },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 6: Write flag incomplete route**

```typescript
// app/api/cases/[id]/flag-incomplete/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { flagIncompleteUpload } from '@/lib/edge-cases/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { instructions } = await request.json();
  if (!instructions) {
    return NextResponse.json({ error: 'instructions are required' }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;
  await flagIncompleteUpload(id, userId, instructions);

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run __tests__/integration/edge-cases.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/api/cron/ app/api/admin/edge-cases/ app/api/cases/[id]/flag-incomplete/ __tests__/integration/edge-cases.test.ts
git commit -m "feat(edge-cases): add cron job, admin routes, and specialist flag-incomplete endpoint"
```

---

### Task 8: Edge Cases Admin Dashboard

**Files:**
- Create: `app/admin/edge-cases/page.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/edge-cases/pending`

- [ ] **Step 1: Create admin dashboard page**

```typescript
// app/admin/edge-cases/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { AlertTriangle, Clock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/table-skeleton"

type UnmatchedCase = {
  id: string
  serviceType: string
  createdAt: string
  patient: { name: string | null; email: string }
}

export default function AdminEdgeCasesPage() {
  const { data, isLoading, refetch } = useQuery<{ cases: UnmatchedCase[] }>({
    queryKey: ["admin-edge-cases"],
    queryFn: async () => {
      const res = await fetch("/api/admin/edge-cases/pending")
      if (!res.ok) throw new Error("Failed to fetch edge cases")
      return res.json()
    },
    staleTime: 30 * 1000,
  })

  const cases = data?.cases ?? []

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Edge Cases</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Cases requiring attention
        </p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={4} />
      ) : cases.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="size-12 text-on-surface-variant mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text-medical-black">No pending edge cases</h2>
          <p className="text-on-surface-variant text-sm mt-1">All cases are being handled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.id} className="border border-error/20 bg-error/5 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                  <Clock className="size-5 text-error" />
                </div>
                <div>
                  <p className="font-medium text-text-medical-black">
                    Case {c.id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {c.patient.name ?? "Unknown"} — Open for {Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60))}h without specialist
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <UserPlus className="size-4 mr-1" />
                Assign
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/edge-cases/
git commit -m "feat(edge-cases): add admin edge cases dashboard"
```

---

### Task 9: Dispute Types, Schema, and Service

**Files:**
- Create: `lib/disputes/types.ts`
- Create: `lib/schemas/dispute.schema.ts`
- Create: `lib/disputes/service.ts`
- Create: `__tests__/unit/disputes/service.test.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db`, `logAuditEvent` from `@/lib/audit/logger`, `notifyAdmin` from `@/lib/notifications/service`
- Produces: `fileDispute()`, `triageDispute()`, `getPeerReviewCandidates()`, `assignPeerReview()`, `resolveDispute()`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/unit/disputes/service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    dispute: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    specialistOpinion: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    doctor: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/audit/logger', () => ({
  logAuditEvent: vi.fn(),
  AUDIT_ACTIONS: { DISPUTE_FILED: 'DISPUTE_FILED', DISPUTE_RESOLVED: 'DISPUTE_RESOLVED' },
}));

vi.mock('@/lib/notifications/service', () => ({
  notifyAdmin: vi.fn(),
  NOTIFICATION_TYPES: { DISPUTE_FILED: 'DISPUTE_FILED' },
}));

import { fileDispute, getPeerReviewCandidates } from '@/lib/disputes/service';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit/logger';
import { notifyAdmin } from '@/lib/notifications/service';

describe('Dispute Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fileDispute creates dispute and logs audit event', async () => {
    vi.mocked(prisma.dispute.create).mockResolvedValue({ id: 'dispute-1' } as any);
    vi.mocked(logAuditEvent).mockResolvedValue();
    vi.mocked(notifyAdmin).mockResolvedValue();

    const result = await fileDispute({
      caseId: 'case-1',
      patientId: 'patient-1',
      opinionId: 'opinion-1',
      reason: 'Diagnosis seems incorrect',
    });

    expect(result.id).toBe('dispute-1');
    expect(prisma.dispute.create).toHaveBeenCalled();
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DISPUTE_FILED' })
    );
    expect(notifyAdmin).toHaveBeenCalled();
  });

  it('getPeerReviewCandidates excludes original specialist', async () => {
    vi.mocked(prisma.specialistOpinion.findUnique).mockResolvedValue({
      specialistId: 'doc-1',
      case: { specialist: { specialty: 'Pathology' } },
    } as any);
    vi.mocked(prisma.doctor.findMany).mockResolvedValue([
      { userId: 'doc-2', specialty: 'Pathology' },
      { userId: 'doc-3', specialty: 'Pathology' },
    ] as any);

    const candidates = await getPeerReviewCandidates('dispute-1');
    expect(candidates).toHaveLength(2);
    expect(candidates.every((c) => c.userId !== 'doc-1')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/disputes/service.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write types**

```typescript
// lib/disputes/types.ts
export interface FileDisputeParams {
  caseId: string;
  patientId: string;
  opinionId: string;
  reason: string;
}

export interface PeerReviewCandidate {
  userId: string;
  name: string | null;
  email: string;
  specialty: string;
}

export enum DisputeStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PEER_REVIEW_ASSIGNED = 'PEER_REVIEW_ASSIGNED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}
```

- [ ] **Step 4: Write schema**

```typescript
// lib/schemas/dispute.schema.ts
import { z } from 'zod';

export const fileDisputeSchema = z.object({
  reason: z.string().min(20, 'Please provide a detailed reason (minimum 20 characters)').max(2000),
});

export type FileDisputeInput = z.infer<typeof fileDisputeSchema>;

export const triageDisputeSchema = z.object({
  valid: z.boolean(),
  adminNotes: z.string().optional(),
});

export type TriageDisputeInput = z.infer<typeof triageDisputeSchema>;

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(10, 'Resolution must be at least 10 characters').max(2000),
  adminNotes: z.string().optional(),
});

export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;

export const assignPeerReviewSchema = z.object({
  specialistId: z.string().min(1, 'Select a specialist'),
});

export type AssignPeerReviewInput = z.infer<typeof assignPeerReviewSchema>;
```

- [ ] **Step 5: Write service implementation**

```typescript
// lib/disputes/service.ts
import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { notifyAdmin, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import type { FileDisputeParams, PeerReviewCandidate } from './types';

export async function fileDispute(params: FileDisputeParams) {
  const dispute = await prisma.dispute.create({
    data: {
      caseId: params.caseId,
      patientId: params.patientId,
      opinionId: params.opinionId,
      reason: params.reason,
      status: 'PENDING',
    },
  });

  await logAuditEvent({
    userId: params.patientId,
    action: AUDIT_ACTIONS.DISPUTE_FILED,
    resourceType: 'Dispute',
    resourceId: dispute.id,
    metadata: { caseId: params.caseId, opinionId: params.opinionId },
  });

  await notifyAdmin({
    type: NOTIFICATION_TYPES.DISPUTE_FILED,
    message: `Patient filed a dispute for case ${params.caseId}`,
    metadata: { disputeId: dispute.id, caseId: params.caseId },
  });

  return dispute;
}

export async function getPeerReviewCandidates(disputeId: string): Promise<PeerReviewCandidate[]> {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      opinion: {
        include: {
          case: {
            include: { specialist: { include: { doctorProfile: true } } },
          },
        },
      },
    },
  });

  if (!dispute) return [];

  const originalSpecialistId = dispute.opinion.specialistId;
  const specialty = dispute.opinion.case.specialist?.doctorProfile?.specialty;

  if (!specialty) return [];

  const candidates = await prisma.doctor.findMany({
    where: {
      specialty,
      verified: true,
      userId: { not: originalSpecialistId },
    },
    include: { user: { select: { name: true, email: true } } },
    take: 3,
  });

  return candidates.map((c) => ({
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    specialty: c.specialty,
  }));
}

export async function triageDispute(
  disputeId: string,
  valid: boolean,
  adminNotes?: string
) {
  const status = valid ? 'UNDER_REVIEW' : 'DISMISSED';
  return prisma.dispute.update({
    where: { id: disputeId },
    data: { status, adminNotes },
  });
}

export async function assignPeerReview(disputeId: string, specialistId: string) {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    select: { caseId: true },
  });

  if (!dispute) throw new Error('Dispute not found');

  const opinion = await prisma.specialistOpinion.create({
    data: {
      caseId: dispute.caseId,
      specialistId,
      content: '',
      status: 'DRAFT',
    },
  });

  await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: 'PEER_REVIEW_ASSIGNED',
      peerReviewOpinionId: opinion.id,
    },
  });

  await logAuditEvent({
    userId: specialistId,
    action: AUDIT_ACTIONS.PEER_REVIEW_ASSIGNED,
    resourceType: 'Dispute',
    resourceId: disputeId,
    metadata: { peerReviewOpinionId: opinion.id },
  });

  return opinion;
}

export async function resolveDispute(
  disputeId: string,
  resolution: string,
  adminNotes?: string
) {
  const dispute = await prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: 'RESOLVED',
      resolution,
      adminNotes,
      resolvedAt: new Date(),
    },
  });

  await logAuditEvent({
    userId: 'system-admin',
    action: AUDIT_ACTIONS.DISPUTE_RESOLVED,
    resourceType: 'Dispute',
    resourceId: disputeId,
    metadata: { resolution },
  });

  return dispute;
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/disputes/service.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add lib/disputes/ lib/schemas/dispute.schema.ts __tests__/unit/disputes/
git commit -m "feat(disputes): add dispute types, schema, and service with full workflow"
```

---

### Task 10: Dispute API Routes (Patient Filing)

**Files:**
- Create: `app/api/cases/[id]/disputes/route.ts`
- Create: `__tests__/integration/disputes-file.test.ts`

**Interfaces:**
- Consumes: `fileDispute` from `@/lib/disputes/service`, `fileDisputeSchema` from `@/lib/schemas/dispute.schema`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/integration/disputes-file.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/disputes/service', () => ({
  fileDispute: vi.fn(),
}));

import { POST } from '@/app/api/cases/[id]/disputes/route';
import { getServerSession } from 'next-auth';
import { fileDispute } from '@/lib/disputes/service';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('File Dispute API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const req = { json: async () => ({ reason: 'Test dispute reason that is long enough' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(401);
  });

  it('returns 403 for non-patient', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-1'));
    const req = { json: async () => ({ reason: 'Test dispute reason that is long enough' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(403);
  });

  it('returns 400 for invalid input', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    const req = { json: async () => ({ reason: 'Short' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(400);
  });

  it('creates dispute for valid patient request', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
    vi.mocked(fileDispute).mockResolvedValue({ id: 'dispute-1' } as any);
    const req = { json: async () => ({ reason: 'This is a detailed dispute reason that meets the minimum length requirement' }) };
    const res = await POST(req as Request, { params: Promise.resolve({ id: 'case-1' }) });
    expect(res.status).toBe(201);
    expect(fileDispute).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/integration/disputes-file.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write API route**

```typescript
// app/api/cases/[id]/disputes/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fileDispute } from '@/lib/disputes/service';
import { fileDisputeSchema } from '@/lib/schemas/dispute.schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = fileDisputeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;

  const dispute = await fileDispute({
    caseId: id,
    patientId: userId,
    opinionId: body.opinionId,
    reason: parsed.data.reason,
  });

  return NextResponse.json(dispute, { status: 201 });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/integration/disputes-file.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/cases/[id]/disputes/ __tests__/integration/disputes-file.test.ts
git commit -m "feat(disputes): add patient dispute filing API route"
```

---

### Task 11: Dispute API Routes (Admin Operations)

**Files:**
- Create: `app/api/admin/disputes/route.ts`
- Create: `app/api/admin/disputes/[id]/route.ts`
- Create: `app/api/admin/disputes/[id]/triage/route.ts`
- Create: `app/api/admin/disputes/[id]/peer-review-candidates/route.ts`
- Create: `app/api/admin/disputes/[id]/assign-peer-review/route.ts`
- Create: `app/api/admin/disputes/[id]/resolve/route.ts`
- Create: `__tests__/integration/disputes-admin.test.ts`

**Interfaces:**
- Consumes: `triageDispute`, `getPeerReviewCandidates`, `assignPeerReview`, `resolveDispute` from `@/lib/disputes/service`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/integration/disputes-admin.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    dispute: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/disputes/service', () => ({
  triageDispute: vi.fn(),
  getPeerReviewCandidates: vi.fn(),
  assignPeerReview: vi.fn(),
  resolveDispute: vi.fn(),
}));

import { GET as listGet } from '@/app/api/admin/disputes/route';
import { GET as detailGet } from '@/app/api/admin/disputes/[id]/route';
import { POST as triagePost } from '@/app/api/admin/disputes/[id]/triage/route';
import { GET as candidatesGet } from '@/app/api/admin/disputes/[id]/peer-review-candidates/route';
import { POST as assignPost } from '@/app/api/admin/disputes/[id]/assign-peer-review/route';
import { POST as resolvePost } from '@/app/api/admin/disputes/[id]/resolve/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { triageDispute, getPeerReviewCandidates, assignPeerReview, resolveDispute } from '@/lib/disputes/service';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('Admin Dispute Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list disputes returns 403 for non-admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
    const res = await listGet(new Request('http://localhost'));
    expect(res.status).toBe(403);
  });

  it('list disputes returns disputes for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(prisma.dispute.findMany).mockResolvedValue([]);
    const res = await listGet(new Request('http://localhost'));
    expect(res.status).toBe(200);
  });

  it('triage returns 403 for non-admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
    const req = { json: async () => ({ valid: true }) };
    const res = await triagePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
    expect(res.status).toBe(403);
  });

  it('triage calls service for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(triageDispute).mockResolvedValue({} as any);
    const req = { json: async () => ({ valid: true, adminNotes: 'Looks valid' }) };
    const res = await triagePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
    expect(res.status).toBe(200);
    expect(triageDispute).toHaveBeenCalledWith('d-1', true, 'Looks valid');
  });

  it('resolve calls service for admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession('ADMIN', 'admin-1'));
    vi.mocked(resolveDispute).mockResolvedValue({} as any);
    const req = { json: async () => ({ resolution: 'Peer review confirmed original opinion' }) };
    const res = await resolvePost(req as Request, { params: Promise.resolve({ id: 'd-1' }) });
    expect(res.status).toBe(200);
    expect(resolveDispute).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/integration/disputes-admin.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write list disputes route**

```typescript
// app/api/admin/disputes/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const disputes = await prisma.dispute.findMany({
    where,
    include: {
      case: { select: { id: true, serviceType: true } },
      patient: { select: { name: true, email: true } },
      opinion: { select: { content: true, specialist: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(disputes, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
```

- [ ] **Step 4: Write dispute detail route**

```typescript
// app/api/admin/disputes/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      case: { select: { id: true, serviceType: true, description: true } },
      patient: { select: { name: true, email: true } },
      opinion: {
        include: { specialist: { select: { name: true, email: true } } },
      },
      peerReviewOpinion: {
        include: { specialist: { select: { name: true, email: true } } },
      },
    },
  });

  if (!dispute) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(dispute);
}
```

- [ ] **Step 5: Write triage route**

```typescript
// app/api/admin/disputes/[id]/triage/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { triageDispute } from '@/lib/disputes/service';
import { triageDisputeSchema } from '@/lib/schemas/dispute.schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = triageDisputeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const dispute = await triageDispute(id, parsed.data.valid, parsed.data.adminNotes);
  return NextResponse.json(dispute);
}
```

- [ ] **Step 6: Write peer review candidates route**

```typescript
// app/api/admin/disputes/[id]/peer-review-candidates/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPeerReviewCandidates } from '@/lib/disputes/service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const candidates = await getPeerReviewCandidates(id);
  return NextResponse.json(candidates);
}
```

- [ ] **Step 7: Write assign peer review route**

```typescript
// app/api/admin/disputes/[id]/assign-peer-review/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { assignPeerReview } from '@/lib/disputes/service';
import { assignPeerReviewSchema } from '@/lib/schemas/dispute.schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = assignPeerReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const opinion = await assignPeerReview(id, parsed.data.specialistId);
  return NextResponse.json(opinion);
}
```

- [ ] **Step 8: Write resolve route**

```typescript
// app/api/admin/disputes/[id]/resolve/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resolveDispute } from '@/lib/disputes/service';
import { resolveDisputeSchema } from '@/lib/schemas/dispute.schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = resolveDisputeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const dispute = await resolveDispute(id, parsed.data.resolution, parsed.data.adminNotes);
  return NextResponse.json(dispute);
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run __tests__/integration/disputes-admin.test.ts`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add app/api/admin/disputes/ __tests__/integration/disputes-admin.test.ts
git commit -m "feat(disputes): add admin dispute API routes - list, detail, triage, peer review, resolve"
```

---

### Task 12: Dispute Pages (Patient + Admin)

**Files:**
- Create: `app/patient/cases/[id]/dispute/page.tsx`
- Create: `app/admin/disputes/columns.tsx`
- Create: `app/admin/disputes/page.tsx`
- Create: `app/admin/disputes/[id]/page.tsx`

**Interfaces:**
- Consumes: `POST /api/cases/[id]/disputes`, `GET /api/admin/disputes`, `POST /api/admin/disputes/[id]/*`

- [ ] **Step 1: Create patient dispute form page**

```typescript
// app/patient/cases/[id]/dispute/page.tsx
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function PatientDisputePage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.id as string
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/cases/${caseId}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to submit dispute")
        return
      }

      router.push(`/patient/cases/${caseId}`)
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-clinical-navy font-bold text-2xl">File a Dispute</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          If you believe the specialist opinion is incorrect, please describe your concern below.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-medical-black mb-1">
            Reason for dispute
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please describe in detail why you believe the opinion should be reviewed..."
            rows={6}
            required
            minLength={20}
          />
          <p className="text-xs text-on-surface-variant mt-1">
            Minimum 20 characters. A peer specialist will review your case.
          </p>
        </div>

        {error && (
          <p className="text-sm text-error">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || reason.length < 20}>
            {submitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Create admin dispute columns**

```typescript
// app/admin/disputes/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DisputeEntry = {
  id: string
  status: string
  reason: string
  createdAt: string
  case: { id: string; serviceType: string }
  patient: { name: string | null; email: string }
  opinion: { specialist: { name: string | null } }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-blue-50 text-blue-600' },
  PEER_REVIEW_ASSIGNED: { label: 'Peer Review', color: 'bg-purple-50 text-purple-600' },
  RESOLVED: { label: 'Resolved', color: 'bg-healing-teal/10 text-healing-teal' },
  DISMISSED: { label: 'Dismissed', color: 'bg-gray-100 text-gray-500' },
}

export const columns: ColumnDef<DisputeEntry>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filed" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-text-medical-black">{row.original.patient.name ?? "Unknown"}</p>
        <p className="text-xs text-on-surface-variant">{row.original.patient.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "case",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Case" />,
    cell: ({ row }) => (
      <span className="text-sm text-text-medical-black">
        {row.original.case.id.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/admin/disputes/${row.original.id}`}
        className="inline-flex items-center gap-1 text-sm text-healing-teal hover:underline"
      >
        View <ArrowRight className="size-3" />
      </Link>
    ),
    enableSorting: false,
  },
]
```

- [ ] **Step 3: Create admin disputes list page**

```typescript
// app/admin/disputes/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type DisputeEntry } from "./columns"

export default function AdminDisputesPage() {
  const { data: disputes, isLoading } = useQuery<DisputeEntry[]>({
    queryKey: ["admin-disputes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disputes")
      if (!res.ok) throw new Error("Failed to fetch disputes")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Disputes</h1>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={disputes ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create admin dispute detail page**

```typescript
// app/admin/disputes/[id]/page.tsx
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "motion/react"
import { ArrowLeft, CheckCircle, XCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

type DisputeDetail = {
  id: string
  status: string
  reason: string
  adminNotes: string | null
  resolution: string | null
  createdAt: string
  resolvedAt: string | null
  case: { id: string; serviceType: string; description: string | null }
  patient: { name: string | null; email: string }
  opinion: { content: string; specialist: { name: string | null; email: string } }
  peerReviewOpinion: { content: string; specialist: { name: string | null; email: string } } | null
}

type PeerCandidate = {
  userId: string
  name: string | null
  email: string
  specialty: string
}

export default function AdminDisputeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const disputeId = params.id as string
  const [adminNotes, setAdminNotes] = useState("")
  const [resolution, setResolution] = useState("")

  const { data: dispute, isLoading } = useQuery<DisputeDetail>({
    queryKey: ["admin-dispute", disputeId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}`)
      if (!res.ok) throw new Error("Failed to fetch dispute")
      return res.json()
    },
  })

  const triageMutation = useMutation({
    mutationFn: async (valid: boolean) => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valid, adminNotes }),
      })
      if (!res.ok) throw new Error("Failed to triage")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-dispute", disputeId] }),
  })

  const resolveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution, adminNotes }),
      })
      if (!res.ok) throw new Error("Failed to resolve")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-dispute", disputeId] }),
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!dispute) return <div className="p-6">Dispute not found</div>

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/disputes" className="text-sm text-healing-teal hover:underline inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="size-3" /> Back to disputes
        </Link>
        <h1 className="text-clinical-navy font-bold text-2xl">Dispute Detail</h1>
        <p className="text-on-surface-variant text-sm">
          Case {dispute.case.id.slice(0, 8)}... — Filed by {dispute.patient.name ?? "Unknown"}
        </p>
      </motion.div>

      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-text-medical-black">Original Opinion</h2>
        <p className="text-sm text-on-surface-variant">By {dispute.opinion.specialist.name}</p>
        <div className="text-sm whitespace-pre-wrap">{dispute.opinion.content || "(Draft - not yet written)"}</div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-text-medical-black">Patient Dispute Reason</h2>
        <p className="text-sm whitespace-pre-wrap">{dispute.reason}</p>
      </div>

      {dispute.peerReviewOpinion && (
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-text-medical-black">Peer Review Opinion</h2>
          <p className="text-sm text-on-surface-variant">By {dispute.peerReviewOpinion.specialist.name}</p>
          <div className="text-sm whitespace-pre-wrap">{dispute.peerReviewOpinion.content}</div>
        </div>
      )}

      {dispute.status === "PENDING" && (
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-text-medical-black">Admin Triage</h2>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add admin notes (optional)..."
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => triageMutation.mutate(false)}>
              <XCircle className="size-4 mr-1" /> Dismiss
            </Button>
            <Button onClick={() => triageMutation.mutate(true)}>
              <CheckCircle className="size-4 mr-1" /> Mark Valid
            </Button>
          </div>
        </div>
      )}

      {dispute.status === "UNDER_REVIEW" && (
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-text-medical-black">Assign Peer Review</h2>
          <PeerReviewAssignment disputeId={disputeId} />
        </div>
      )}

      {dispute.status === "PEER_REVIEW_ASSIGNED" && (
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-text-medical-black">Resolve Dispute</h2>
          <Textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Document the resolution..."
            rows={4}
          />
          <Button onClick={() => resolveMutation.mutate()} disabled={resolution.length < 10}>
            Resolve Dispute
          </Button>
        </div>
      )}

      {dispute.resolution && (
        <div className="border border-healing-teal/20 bg-healing-teal/5 rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-text-medical-black">Resolution</h2>
          <p className="text-sm whitespace-pre-wrap">{dispute.resolution}</p>
          {dispute.adminNotes && (
            <p className="text-xs text-on-surface-variant">Notes: {dispute.adminNotes}</p>
          )}
        </div>
      )}
    </div>
  )
}

function PeerReviewAssignment({ disputeId }: { disputeId: string }) {
  const [candidates, setCandidates] = useState<PeerCandidate[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)

  async function loadCandidates() {
    if (candidates.length > 0) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/peer-review-candidates`)
      if (res.ok) setCandidates(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function assign(specialistId: string) {
    setAssigning(specialistId)
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}/assign-peer-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialistId }),
      })
      if (res.ok) window.location.reload()
    } finally {
      setAssigning(null)
    }
  }

  return (
    <div onMouseEnter={loadCandidates}>
      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No matching specialists found</p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c) => (
            <div key={c.userId} className="flex items-center justify-between border rounded p-3">
              <div>
                <p className="font-medium text-sm">{c.name ?? "Unknown"}</p>
                <p className="text-xs text-on-surface-variant">{c.specialty}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => assign(c.userId)}
                disabled={assigning === c.userId}
              >
                <UserPlus className="size-3 mr-1" />
                {assigning === c.userId ? "Assigning..." : "Assign"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/patient/cases/[id]/dispute/ app/admin/disputes/
git commit -m "feat(disputes): add patient dispute form and admin dispute management pages"
```

---

### Task 13: GDPR Types, Schema, and Service

**Files:**
- Create: `lib/gdpr/types.ts`
- Create: `lib/schemas/gdpr.schema.ts`
- Create: `lib/gdpr/service.ts`
- Create: `__tests__/unit/gdpr/service.test.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db`, `logAuditEvent` from `@/lib/audit/logger`
- Produces: `getConsent()`, `updateConsent()`, `requestExport()`, `requestDeletion()`, `confirmDeletion()`, `cancelDeletion()`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/unit/gdpr/service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    consentRecord: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    dataDeletionRequest: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/audit/logger', () => ({
  logAuditEvent: vi.fn(),
  AUDIT_ACTIONS: {
    CONSENT_GIVEN: 'CONSENT_GIVEN',
    CONSENT_REVOKED: 'CONSENT_REVOKED',
    DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
    DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
  },
}));

import { getConsent, updateConsent, requestDeletion } from '@/lib/gdpr/service';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit/logger';

describe('GDPR Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getConsent returns consent records for patient', async () => {
    vi.mocked(prisma.consentRecord.findMany).mockResolvedValue([
      { consentType: 'AI_PROCESSING', granted: true },
    ] as any);

    const result = await getConsent('patient-1');
    expect(result).toHaveLength(1);
    expect(prisma.consentRecord.findMany).toHaveBeenCalledWith({
      where: { patientId: 'patient-1' },
    });
  });

  it('updateConsent creates or updates consent and logs audit', async () => {
    vi.mocked(prisma.consentRecord.upsert).mockResolvedValue({} as any);
    vi.mocked(logAuditEvent).mockResolvedValue();

    await updateConsent('patient-1', 'AI_PROCESSING', true);

    expect(prisma.consentRecord.upsert).toHaveBeenCalled();
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CONSENT_GIVEN' })
    );
  });

  it('requestDeletion creates deletion request with 30-day grace', async () => {
    vi.mocked(prisma.dataDeletionRequest.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.dataDeletionRequest.create).mockResolvedValue({} as any);
    vi.mocked(logAuditEvent).mockResolvedValue();

    await requestDeletion('patient-1');

    expect(prisma.dataDeletionRequest.create).toHaveBeenCalled();
    const call = vi.mocked(prisma.dataDeletionRequest.create).mock.calls[0][0];
    const executeAt = call.data.executeAt as Date;
    const diff = executeAt.getTime() - Date.now();
    expect(diff).toBeGreaterThan(29 * 24 * 60 * 60 * 1000);
    expect(diff).toBeLessThan(31 * 24 * 60 * 60 * 1000);
  });

  it('requestDeletion rejects if pending request exists', async () => {
    vi.mocked(prisma.dataDeletionRequest.findFirst).mockResolvedValue({ id: 'existing' } as any);

    await expect(requestDeletion('patient-1')).rejects.toThrow('Deletion request already pending');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/unit/gdpr/service.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write types**

```typescript
// lib/gdpr/types.ts
export enum ConsentType {
  AI_PROCESSING = 'AI_PROCESSING',
  DATA_SHARING = 'DATA_SHARING',
}

export interface ConsentStatus {
  consentType: string;
  granted: boolean;
  grantedAt: Date | null;
  revokedAt: Date | null;
}
```

- [ ] **Step 4: Write schema**

```typescript
// lib/schemas/gdpr.schema.ts
import { z } from 'zod';

export const consentSchema = z.object({
  consentType: z.enum(['AI_PROCESSING', 'DATA_SHARING']),
  granted: z.boolean(),
});

export type ConsentInput = z.infer<typeof consentSchema>;
```

- [ ] **Step 5: Write service implementation**

```typescript
// lib/gdpr/service.ts
import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import type { ConsentStatus } from './types';

const GRACE_PERIOD_DAYS = 30;

export async function getConsent(patientId: string): Promise<ConsentStatus[]> {
  return prisma.consentRecord.findMany({
    where: { patientId },
  }) as Promise<ConsentStatus[]>;
}

export async function updateConsent(
  patientId: string,
  consentType: string,
  granted: boolean
): Promise<void> {
  await prisma.consentRecord.upsert({
    where: { patientId_consentType: { patientId, consentType } },
    update: {
      granted,
      grantedAt: granted ? new Date() : null,
      revokedAt: granted ? null : new Date(),
    },
    create: {
      patientId,
      consentType,
      granted,
      grantedAt: granted ? new Date() : null,
      revokedAt: granted ? null : new Date(),
    },
  });

  await logAuditEvent({
    userId: patientId,
    action: granted ? AUDIT_ACTIONS.CONSENT_GIVEN : AUDIT_ACTIONS.CONSENT_REVOKED,
    resourceType: 'ConsentRecord',
    resourceId: `${patientId}-${consentType}`,
    metadata: { consentType, granted },
  });
}

export async function requestDeletion(patientId: string) {
  const existing = await prisma.dataDeletionRequest.findFirst({
    where: { patientId, status: 'PENDING' },
  });

  if (existing) {
    throw new Error('Deletion request already pending');
  }

  const now = new Date();
  const executeAt = new Date(now.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  const request = await prisma.dataDeletionRequest.create({
    data: {
      patientId,
      status: 'PENDING',
      requestedAt: now,
      executeAt,
    },
  });

  await logAuditEvent({
    userId: patientId,
    action: AUDIT_ACTIONS.DATA_DELETION_REQUESTED,
    resourceType: 'DataDeletionRequest',
    resourceId: request.id,
    metadata: { executeAt: executeAt.toISOString() },
  });

  return request;
}

export async function confirmDeletion(patientId: string) {
  const request = await prisma.dataDeletionRequest.findFirst({
    where: { patientId, status: 'PENDING' },
  });

  if (!request) throw new Error('No pending deletion request');

  return prisma.dataDeletionRequest.update({
    where: { id: request.id },
    data: { status: 'CONFIRMED' },
  });
}

export async function cancelDeletion(patientId: string) {
  const request = await prisma.dataDeletionRequest.findFirst({
    where: { patientId, status: 'PENDING' },
  });

  if (!request) throw new Error('No pending deletion request');

  return prisma.dataDeletionRequest.update({
    where: { id: request.id },
    data: { status: 'CANCELLED' },
  });
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run __tests__/unit/gdpr/service.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add lib/gdpr/ lib/schemas/gdpr.schema.ts __tests__/unit/gdpr/
git commit -m "feat(gdpr): add GDPR service with consent management and deletion with grace period"
```

---

### Task 14: GDPR API Routes

**Files:**
- Create: `app/api/patient/consent/route.ts`
- Create: `app/api/patient/data-export/route.ts`
- Create: `app/api/patient/data-deletion/route.ts`
- Create: `app/api/patient/data-deletion/confirm/route.ts`
- Create: `app/api/patient/data-deletion/cancel/route.ts`
- Create: `app/api/admin/data-requests/route.ts`
- Create: `__tests__/integration/gdpr.test.ts`

**Interfaces:**
- Consumes: `getConsent`, `updateConsent`, `requestDeletion`, `confirmDeletion`, `cancelDeletion` from `@/lib/gdpr/service`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/integration/gdpr.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/gdpr/service', () => ({
  getConsent: vi.fn(),
  updateConsent: vi.fn(),
  requestDeletion: vi.fn(),
  confirmDeletion: vi.fn(),
  cancelDeletion: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    dataDeletionRequest: { findMany: vi.fn() },
  },
}));

import { GET as consentGet, POST as consentPost } from '@/app/api/patient/consent/route';
import { POST as deletionPost } from '@/app/api/patient/data-deletion/route';
import { POST as confirmPost } from '@/app/api/patient/data-deletion/confirm/route';
import { POST as cancelPost } from '@/app/api/patient/data-deletion/cancel/route';
import { getServerSession } from 'next-auth';
import { getConsent, updateConsent, requestDeletion, confirmDeletion, cancelDeletion } from '@/lib/gdpr/service';

function mockSession(role: string, id: string) {
  return { user: { role, id } };
}

describe('GDPR API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Consent', () => {
    it('GET returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await consentGet();
      expect(res.status).toBe(401);
    });

    it('GET returns consent for patient', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(getConsent).mockResolvedValue([]);
      const res = await consentGet();
      expect(res.status).toBe(200);
    });

    it('POST updates consent', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(updateConsent).mockResolvedValue();
      const req = { json: async () => ({ consentType: 'AI_PROCESSING', granted: true }) };
      const res = await consentPost(req as Request);
      expect(res.status).toBe(200);
      expect(updateConsent).toHaveBeenCalledWith('p-1', 'AI_PROCESSING', true);
    });
  });

  describe('Deletion', () => {
    it('POST returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await deletionPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(401);
    });

    it('POST requests deletion', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'p-1'));
      vi.mocked(requestDeletion).mockResolvedValue({} as any);
      const res = await deletionPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(200);
    });

    it('confirm returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await confirmPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(401);
    });

    it('cancel returns 401 without session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const res = await cancelPost({ json: async () => ({}) } as Request);
      expect(res.status).toBe(401);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/integration/gdpr.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write consent route**

```typescript
// app/api/patient/consent/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getConsent, updateConsent } from '@/lib/gdpr/service';
import { consentSchema } from '@/lib/schemas/gdpr.schema';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const consent = await getConsent(userId);
  return NextResponse.json(consent);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await request.json();
  const parsed = consentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await updateConsent(userId, parsed.data.consentType, parsed.data.granted);
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Write data export route**

```typescript
// app/api/patient/data-export/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const patient = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      cases: {
        include: {
          records: true,
          opinions: { include: { specialist: { select: { name: true } } } },
        },
      },
      labResults: { include: { metrics: true } },
      consentRecords: true,
    },
  });

  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await logAuditEvent({
    userId,
    action: AUDIT_ACTIONS.DATA_EXPORT_REQUESTED,
    resourceType: 'User',
    resourceId: userId,
  });

  return NextResponse.json({ data: patient, format: 'json' });
}
```

- [ ] **Step 5: Write deletion routes**

```typescript
// app/api/patient/data-deletion/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requestDeletion } from '@/lib/gdpr/service';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const request = await requestDeletion(userId);
    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
```

```typescript
// app/api/patient/data-deletion/confirm/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { confirmDeletion } from '@/lib/gdpr/service';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    await confirmDeletion(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
```

```typescript
// app/api/patient/data-deletion/cancel/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cancelDeletion } from '@/lib/gdpr/service';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    await cancelDeletion(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
```

- [ ] **Step 6: Write admin data requests route**

```typescript
// app/api/admin/data-requests/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const deletionRequests = await prisma.dataDeletionRequest.findMany({
    include: { patient: { select: { name: true, email: true } } },
    orderBy: { requestedAt: 'desc' },
  });

  return NextResponse.json(deletionRequests, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run __tests__/integration/gdpr.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/api/patient/ app/api/admin/data-requests/ __tests__/integration/gdpr.test.ts
git commit -m "feat(gdpr): add GDPR API routes - consent, data export, deletion with grace period"
```

---

### Task 15: GDPR Pages (Patient Privacy Settings + Admin Data Requests)

**Files:**
- Create: `app/patient/settings/privacy/page.tsx`
- Create: `app/admin/data-requests/columns.tsx`
- Create: `app/admin/data-requests/page.tsx`

**Interfaces:**
- Consumes: `GET/POST /api/patient/consent`, `POST /api/patient/data-export`, `POST /api/patient/data-deletion/*`, `GET /api/admin/data-requests`

- [ ] **Step 1: Create patient privacy settings page**

```typescript
// app/patient/settings/privacy/page.tsx
"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Shield, Download, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function PatientPrivacyPage() {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState(false)

  const { data: consent } = useQuery<{ consentType: string; granted: boolean }[]>({
    queryKey: ["patient-consent"],
    queryFn: async () => {
      const res = await fetch("/api/patient/consent")
      if (!res.ok) throw new Error("Failed")
      return res.json()
    },
  })

  const consentMutation = useMutation({
    mutationFn: async ({ type, granted }: { type: string; granted: boolean }) => {
      await fetch("/api/patient/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentType: type, granted }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patient-consent"] }),
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/patient/data-export", { method: "POST" })
      if (!res.ok) throw new Error("Export failed")
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `drbubalcare-data-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
  })

  const deletionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/patient/data-deletion", { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      return res.json()
    },
    onSuccess: () => setDeleting(false),
  })

  const aiProcessing = consent?.find((c) => c.consentType === "AI_PROCESSING")?.granted ?? false
  const dataSharing = consent?.find((c) => c.consentType === "DATA_SHARING")?.granted ?? false

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Patient Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Privacy Settings</h1>
      </motion.div>

      <div className="border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-5 text-healing-teal" />
          <h2 className="font-semibold text-text-medical-black">Consent Management</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">AI Processing</p>
            <p className="text-xs text-on-surface-variant">Allow AI to analyze your clinical data for pre-screening and summaries</p>
          </div>
          <Switch
            checked={aiProcessing}
            onCheckedChange={(checked) => consentMutation.mutate({ type: "AI_PROCESSING", granted: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Data Sharing with Specialists</p>
            <p className="text-xs text-on-surface-variant">Allow sharing your data with assigned specialists for review</p>
          </div>
          <Switch
            checked={dataSharing}
            onCheckedChange={(checked) => consentMutation.mutate({ type: "DATA_SHARING", granted: checked })}
          />
        </div>
      </div>

      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-text-medical-black">Your Data</h2>

        <Button variant="outline" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
          <Download className="size-4 mr-2" />
          {exportMutation.isPending ? "Exporting..." : "Export My Data"}
        </Button>
      </div>

      <div className="border border-error/20 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-error" />
          <h2 className="font-semibold text-error">Danger Zone</h2>
        </div>

        {!deleting ? (
          <Button variant="outline" onClick={() => setDeleting(true)}>
            <Trash2 className="size-4 mr-2" />
            Request Data Deletion
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-on-surface-variant">
              Are you sure? Your data will be deleted after a 30-day grace period. You can cancel within that time.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleting(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => deletionMutation.mutate()}
                disabled={deletionMutation.isPending}
              >
                {deletionMutation.isPending ? "Processing..." : "Confirm Deletion"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create admin data requests columns**

```typescript
// app/admin/data-requests/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DataRequestEntry = {
  id: string
  patientId: string
  status: string
  requestedAt: string
  executeAt: string
  completedAt: string | null
  patient: { name: string | null; email: string }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending (30-day grace)', color: 'bg-amber-50 text-amber-600' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
  COMPLETED: { label: 'Completed', color: 'bg-healing-teal/10 text-healing-teal' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
}

export const columns: ColumnDef<DataRequestEntry>[] = [
  {
    accessorKey: "requestedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requested" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.requestedAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-text-medical-black">{row.original.patient.name ?? "Unknown"}</p>
        <p className="text-xs text-on-surface-variant">{row.original.patient.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: "executeAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Execute After" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.executeAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    ),
  },
]
```

- [ ] **Step 3: Create admin data requests page**

```typescript
// app/admin/data-requests/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type DataRequestEntry } from "./columns"

export default function AdminDataRequestsPage() {
  const { data: requests, isLoading } = useQuery<DataRequestEntry[]>({
    queryKey: ["admin-data-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/data-requests")
      if (!res.ok) throw new Error("Failed to fetch data requests")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Data Requests</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          GDPR data deletion requests and their status
        </p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={4} search />
      ) : (
        <DataTable
          columns={columns}
          data={requests ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/patient/settings/privacy/ app/admin/data-requests/
git commit -m "feat(gdpr): add patient privacy settings page and admin data requests dashboard"
```

---

### Task 16: Update Constants and Navigation

**Files:**
- Modify: `lib/constants.ts`

**Interfaces:**
- Consumes: New dispute statuses

- [ ] **Step 1: Add dispute status constants**

Add to `lib/constants.ts`:

```typescript
export const DISPUTE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-blue-50 text-blue-600' },
  PEER_REVIEW_ASSIGNED: { label: 'Peer Review', color: 'bg-purple-50 text-purple-600' },
  RESOLVED: { label: 'Resolved', color: 'bg-healing-teal/10 text-healing-teal' },
  DISMISSED: { label: 'Dismissed', color: 'bg-gray-100 text-gray-500' },
}

export const DELETION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-600' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
  COMPLETED: { label: 'Completed', color: 'bg-healing-teal/10 text-healing-teal' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/constants.ts
git commit -m "feat(constants): add dispute and deletion status configs"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-19-phase5-compliance-scale.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
