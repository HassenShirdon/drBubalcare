# Phase 2: Specialist Portal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the specialist portal experience — admin verification, manual case routing, doctor opinion writing/signing, and patient report delivery.

**Architecture:** Add `verified` boolean to Doctor model. Admin pages for verification and case routing. Doctor pages for viewing assigned cases and writing structured opinions. Update patient case detail to display signed opinions. All new API routes follow existing NextAuth + Prisma patterns.

**Tech Stack:** Next.js 15 (App Router), Prisma 7 (Neon PostgreSQL), NextAuth v4 (Credentials), React Query, Zod, shadcn/ui, Tailwind CSS v4, Lucide icons

## Global Constraints

- Next.js 15.5.20 with App Router and Turbopack
- Prisma 7.8.0 with `prisma-client` generator, output to `lib/generated/prisma`
- NextAuth v4 with Credentials provider, JWT strategy
- Tailwind CSS v4 with custom Material Design tokens (clinical-navy, healing-teal, etc.)
- shadcn/ui base-nova style (Button, Card, Input, Label installed)
- React Query for server state, Zustand for client state
- React Hook Form + Zod for form validation
- Lucide React for icons
- All API routes use `getServerSession(authOptions)` for auth
- Role-based access: check `session.user.role` as string
- File uploads save to `public/uploads/`

---

## File Structure

### New Files (14)
| File | Purpose |
|------|---------|
| `app/admin/specialists/page.tsx` | Specialist verification table (server component) |
| `app/admin/specialists/verify-button.tsx` | Client component for verify toggle |
| `app/admin/cases/page.tsx` | Case routing table (client component) |
| `app/doctor/cases/page.tsx` | My Cases list (client component) |
| `app/doctor/cases/[id]/page.tsx` | Case review + opinion form (client component) |
| `app/api/admin/specialists/route.ts` | GET list all doctors |
| `app/api/admin/specialists/[id]/verify/route.ts` | PATCH toggle verified |
| `app/api/admin/cases/route.ts` | GET list cases for admin |
| `app/api/admin/cases/[id]/assign/route.ts` | PATCH assign specialist |
| `app/api/doctor/cases/route.ts` | GET list assigned cases |
| `app/api/doctor/cases/[id]/route.ts` | GET case detail for doctor |
| `app/api/doctor/cases/[id]/opinion/route.ts` | GET/POST opinion |
| `lib/hooks/use-admin.ts` | React Query hooks for admin |
| `lib/hooks/use-doctor-cases.ts` | React Query hooks for doctor cases |

### Modified Files (5)
| File | Change |
|------|--------|
| `prisma/schema.prisma` | Add `verified Boolean @default(false)` to Doctor |
| `app/admin/layout.tsx` | Add Specialists + Cases nav items |
| `app/doctor/layout.tsx` | Add My Cases nav item |
| `app/patient/cases/[id]/page.tsx` | Update opinion display to parse markdown sections |
| `lib/hooks/index.ts` | Export new hooks |

---

### Task 1: Schema Migration — Add Verified to Doctor

**Files:**
- Modify: `prisma/schema.prisma:97-113`

**Interfaces:**
- Consumes: existing Doctor model
- Produces: Doctor model with `verified` field

- [ ] **Step 1: Add verified field to Doctor model**

In `prisma/schema.prisma`, add `verified` field to the Doctor model after `imageUrl`:

```prisma
model Doctor {
  id            String   @id @default(cuid())
  userId        String   @unique
  specialty     String
  experience    String
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  locationType  String   @default("Telehealth & In-person")
  bio           String?
  imageUrl      String?
  verified      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  services      DoctorService[]
  appointments  Appointment[]     @relation("DoctorAppointments")
}
```

- [ ] **Step 2: Run Prisma migration**

Run: `npx prisma migrate dev --name add_doctor_verified`
Expected: Migration created successfully, Prisma client regenerated

- [ ] **Step 3: Verify generated client includes verified**

Run: `npx prisma studio` — check Doctor model has `verified` field
Or: `grep -r "verified" lib/generated/prisma/` — should find the field

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add verified field to Doctor model for specialist verification"
```

---

### Task 2: Admin Verification API

**Files:**
- Create: `app/api/admin/specialists/route.ts`
- Create: `app/api/admin/specialists/[id]/verify/route.ts`

**Interfaces:**
- Consumes: Doctor model with `verified` field (Task 1)
- Produces: GET /api/admin/specialists, PATCH /api/admin/specialists/[id]/verify

- [ ] **Step 1: Create GET /api/admin/specialists**

Create `app/api/admin/specialists/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const doctors = await prisma.doctor.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(doctors);
}
```

- [ ] **Step 2: Create PATCH /api/admin/specialists/[id]/verify**

Create `app/api/admin/specialists/[id]/verify/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

  const updated = await prisma.doctor.update({
    where: { id },
    data: { verified: body.verified },
  });

  return NextResponse.json(updated);
}
```

- [ ] **Step 3: Test API routes**

Run: `npx next dev --turbopack`
Test: `curl http://localhost:3000/api/admin/specialists` — should return 401 (no session)
Test: Login as admin, then `curl -b <cookie> http://localhost:3000/api/admin/specialists` — should return doctor list

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/specialists/
git commit -m "feat: add admin specialist verification API routes"
```

---

### Task 3: Admin Verification Page

**Files:**
- Create: `app/admin/specialists/page.tsx`
- Create: `app/admin/specialists/verify-button.tsx`
- Modify: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: GET /api/admin/specialists, PATCH /api/admin/specialists/[id]/verify (Task 2)
- Produces: /admin/specialists page

- [ ] **Step 1: Create verify-button client component**

Create `app/admin/specialists/verify-button.tsx`:

```tsx
"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyButton({ doctorId, verified }: { doctorId: string; verified: boolean }) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newVerified: boolean) => {
      const res = await fetch(`/api/admin/specialists/${doctorId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: newVerified }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-specialists'] });
      setConfirmOpen(false);
    },
  });

  if (confirmOpen) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-on-surface-variant">
          {verified ? 'Unverify?' : 'Verify?'}
        </span>
        <button
          onClick={() => mutation.mutate(!verified)}
          disabled={mutation.isPending}
          className="text-xs px-2 py-1 rounded bg-clinical-navy text-white hover:bg-clinical-navy/90 disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
          className="text-xs px-2 py-1 rounded bg-surface-gray text-on-surface-variant hover:bg-surface-gray/80"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmOpen(true)}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
        verified
          ? 'bg-healing-teal/10 text-healing-teal hover:bg-healing-teal/20'
          : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
      }`}
    >
      {verified ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {verified ? 'Verified' : 'Unverified'}
    </button>
  );
}
```

- [ ] **Step 2: Create admin specialists page**

Create `app/admin/specialists/page.tsx`:

```tsx
"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Loader2, Search } from 'lucide-react';
import { VerifyButton } from './verify-button';

type DoctorWithUser = {
  id: string;
  specialty: string;
  experience: string;
  verified: boolean;
  user: { id: string; name: string | null; email: string; createdAt: string };
};

export default function AdminSpecialistsPage() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [search, setSearch] = useState('');

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['admin-specialists'],
    queryFn: async () => {
      const res = await fetch('/api/admin/specialists');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const filtered = (doctors ?? [])
    .filter((d: DoctorWithUser) => {
      if (filter === 'verified') return d.verified;
      if (filter === 'unverified') return !d.verified;
      return true;
    })
    .filter((d: DoctorWithUser) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        d.user.name?.toLowerCase().includes(q) ||
        d.user.email.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">Specialist Verification</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review and verify specialist credentials.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search specialists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy"
          />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {(['all', 'verified', 'unverified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-clinical-navy text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-gray overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-gray bg-surface-container-low">
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Specialty</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Joined</th>
                <th className="text-right px-4 py-3 font-semibold text-clinical-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant">
                    No specialists found.
                  </td>
                </tr>
              ) : (
                filtered.map((doctor: DoctorWithUser) => (
                  <tr key={doctor.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-medium text-clinical-navy">
                      {doctor.user.name ?? 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{doctor.specialty}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{doctor.user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        doctor.verified
                          ? 'bg-healing-teal/10 text-healing-teal'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        <Shield className="size-3" />
                        {doctor.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {new Date(doctor.user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <VerifyButton doctorId={doctor.id} verified={doctor.verified} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add Specialists nav item to admin layout**

In `app/admin/layout.tsx`, add the Specialists link after the News link. Import `Shield` from lucide-react:

```tsx
import { LogOut, Newspaper, Shield, Briefcase } from 'lucide-react';
```

Add after the News link:

```tsx
<Link
  href="/admin/specialists"
  className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
>
  <Shield className="size-4" />
  Specialists
</Link>
<Link
  href="/admin/cases"
  className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
>
  <Briefcase className="size-4" />
  Cases
</Link>
```

- [ ] **Step 4: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/admin/specialists` — should show table of doctors with verify buttons
Test: Click verify button → confirmation → status toggles

- [ ] **Step 5: Commit**

```bash
git add app/admin/specialists/ app/admin/layout.tsx
git commit -m "feat: add admin specialist verification page with toggle"
```

---

### Task 4: Admin Case Routing API

**Files:**
- Create: `app/api/admin/cases/route.ts`
- Create: `app/api/admin/cases/[id]/assign/route.ts`

**Interfaces:**
- Consumes: Case model, Doctor model with `verified` field (Task 1)
- Produces: GET /api/admin/cases, PATCH /api/admin/cases/[id]/assign

- [ ] **Step 1: Create GET /api/admin/cases**

Create `app/api/admin/cases/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const cases = await prisma.case.findMany({
    include: {
      patient: { select: { name: true, email: true } },
      specialist: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(cases);
}
```

- [ ] **Step 2: Create PATCH /api/admin/cases/[id]/assign**

Create `app/api/admin/cases/[id]/assign/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  const caseRecord = await prisma.case.findUnique({ where: { id } });
  if (!caseRecord) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  // Verify the specialist exists and is verified
  if (body.specialistId) {
    const doctor = await prisma.doctor.findFirst({
      where: { userId: body.specialistId, verified: true },
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Specialist not found or not verified' }, { status: 400 });
    }
  }

  const updated = await prisma.case.update({
    where: { id },
    data: {
      specialistId: body.specialistId || null,
      status: body.specialistId ? 'UNDER_REVIEW' : 'OPEN',
    },
  });

  return NextResponse.json(updated);
}
```

- [ ] **Step 3: Test API routes**

Run: `npx next dev --turbopack`
Test: Login as admin, `curl -b <cookie> http://localhost:3000/api/admin/cases` — should return case list
Test: `curl -X PATCH -b <cookie> -H 'Content-Type: application/json' -d '{"specialistId":"..."}' http://localhost:3000/api/admin/cases/<id>/assign` — should assign and transition status

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/cases/
git commit -m "feat: add admin case routing API routes"
```

---

### Task 5: Admin Case Routing Page

**Files:**
- Create: `app/admin/cases/page.tsx`

**Interfaces:**
- Consumes: GET /api/admin/cases, PATCH /api/admin/cases/[id]/assign (Task 4), GET /api/admin/specialists (Task 2)
- Produces: /admin/cases page

- [ ] **Step 1: Create admin cases page**

Create `app/admin/cases/page.tsx`:

```tsx
"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Loader2, Search, UserPlus, RefreshCw } from 'lucide-react';

type CaseWithRelations = {
  id: string;
  serviceType: string;
  status: string;
  createdAt: string;
  patient: { name: string | null; email: string };
  specialist: { name: string | null; email: string } | null;
};

type DoctorWithUser = {
  id: string;
  userId: string;
  specialty: string;
  verified: boolean;
  user: { name: string | null; email: string };
};

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up',
  TREND_ANALYSIS: 'Trend Analysis',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
};

export default function AdminCasesPage() {
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'under_review'>('all');
  const [search, setSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: cases, isLoading } = useQuery({
    queryKey: ['admin-cases'],
    queryFn: async () => {
      const res = await fetch('/api/admin/cases');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const { data: doctors } = useQuery({
    queryKey: ['admin-specialists'],
    queryFn: async () => {
      const res = await fetch('/api/admin/specialists');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ caseId, specialistId }: { caseId: string; specialistId: string | null }) => {
      const res = await fetch(`/api/admin/cases/${caseId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialistId }),
      });
      if (!res.ok) throw new Error('Failed to assign');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cases'] });
      setAssigningId(null);
    },
  });

  const verifiedDoctors = (doctors ?? []).filter((d: DoctorWithUser) => d.verified);

  const filtered = (cases ?? [])
    .filter((c: CaseWithRelations) => {
      if (filter === 'unassigned') return !c.specialist;
      if (filter === 'under_review') return c.status === 'UNDER_REVIEW';
      return true;
    })
    .filter((c: CaseWithRelations) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.patient.name?.toLowerCase().includes(q) ||
        c.patient.email.toLowerCase().includes(q) ||
        c.serviceType.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">Case Routing</h1>
        <p className="text-on-surface-variant text-sm mt-1">Assign cases to verified specialists.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy"
          />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {(['all', 'unassigned', 'under_review'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-clinical-navy text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unassigned' ? 'Unassigned' : 'Under Review'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-gray overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-gray bg-surface-container-low">
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Service Type</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Specialist</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Created</th>
                <th className="text-right px-4 py-3 font-semibold text-clinical-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant">
                    No cases found.
                  </td>
                </tr>
              ) : (
                filtered.map((c: CaseWithRelations) => {
                  const s = statusConfig[c.status] || statusConfig.OPEN;
                  return (
                    <tr key={c.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low/50">
                      <td className="px-4 py-3 font-medium text-clinical-navy">
                        {c.patient.name ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {serviceTypeLabels[c.serviceType] || c.serviceType}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant text-xs">
                        {c.specialist?.name ?? <span className="text-amber-500 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant text-xs">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {assigningId === c.id ? (
                          <div className="flex items-center gap-2 justify-end">
                            <select
                              className="text-xs border border-surface-gray rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20"
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignMutation.mutate({ caseId: c.id, specialistId: e.target.value });
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Select specialist...</option>
                              {verifiedDoctors.map((d: DoctorWithUser) => (
                                <option key={d.userId} value={d.userId}>
                                  {d.user.name} ({d.specialty})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => setAssigningId(null)}
                              className="text-xs text-on-surface-variant hover:text-error"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningId(c.id)}
                            className="inline-flex items-center gap-1 text-xs text-clinical-navy hover:text-healing-teal font-medium transition-colors"
                          >
                            {c.specialist ? <RefreshCw className="size-3" /> : <UserPlus className="size-3" />}
                            {c.specialist ? 'Reassign' : 'Assign'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/admin/cases` — should show cases with assign buttons
Test: Click Assign → dropdown of verified specialists → select → case status changes to UNDER_REVIEW

- [ ] **Step 3: Commit**

```bash
git add app/admin/cases/page.tsx
git commit -m "feat: add admin case routing page with specialist assignment"
```

---

### Task 6: Doctor Cases List API

**Files:**
- Create: `app/api/doctor/cases/route.ts`
- Create: `app/api/doctor/cases/[id]/route.ts`

**Interfaces:**
- Consumes: Case model, SpecialistOpinion model
- Produces: GET /api/doctor/cases, GET /api/doctor/cases/[id]

- [ ] **Step 1: Create GET /api/doctor/cases**

Create `app/api/doctor/cases/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const cases = await prisma.case.findMany({
    where: { specialistId: userId },
    include: {
      patient: { select: { name: true, email: true } },
      opinions: {
        where: { specialistId: userId },
        select: { id: true, status: true, signedAt: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(cases);
}
```

- [ ] **Step 2: Create GET /api/doctor/cases/[id]**

Create `app/api/doctor/cases/[id]/route.ts`:

```typescript
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

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const caseRecord = await prisma.case.findFirst({
    where: { id, specialistId: userId },
    include: {
      patient: { select: { name: true, email: true } },
      records: true,
      aiPrescreens: { take: 1 },
      opinions: {
        where: { specialistId: userId },
        include: { specialist: { select: { name: true } } },
        take: 1,
      },
    },
  });

  if (!caseRecord) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  return NextResponse.json(caseRecord);
}
```

- [ ] **Step 3: Test API routes**

Run: `npx next dev --turbopack`
Test: Login as doctor, `curl -b <cookie> http://localhost:3000/api/doctor/cases` — should return assigned cases
Test: `curl -b <cookie> http://localhost:3000/api/doctor/cases/<id>` — should return case detail with records

- [ ] **Step 4: Commit**

```bash
git add app/api/doctor/cases/
git commit -m "feat: add doctor cases API routes"
```

---

### Task 7: Doctor Cases List Page

**Files:**
- Create: `app/doctor/cases/page.tsx`
- Create: `lib/hooks/use-doctor-cases.ts`
- Modify: `lib/hooks/index.ts`
- Modify: `app/doctor/layout.tsx`

**Interfaces:**
- Consumes: GET /api/doctor/cases (Task 6)
- Produces: /doctor/cases page, useDoctorCases hook

- [ ] **Step 1: Create useDoctorCases hook**

Create `lib/hooks/use-doctor-cases.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useDoctorCases() {
  return useQuery({
    queryKey: ['doctor-cases'],
    queryFn: async () => {
      const res = await fetch('/api/doctor/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
  });
}

export function useDoctorCase(id: string) {
  return useQuery({
    queryKey: ['doctor-case', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctor/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useSubmitOpinion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caseId,
      content,
      sign,
    }: {
      caseId: string;
      content: string;
      sign: boolean;
    }) => {
      const res = await fetch(`/api/doctor/cases/${caseId}/opinion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sign }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit opinion');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-cases'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-case'] });
    },
  });
}
```

- [ ] **Step 2: Export new hooks**

In `lib/hooks/index.ts`, add:

```typescript
export * from './use-doctor-cases';
```

- [ ] **Step 3: Create doctor cases page**

Create `app/doctor/cases/page.tsx`:

```tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDoctorCases } from '@/lib/hooks/use-doctor-cases';
import { Briefcase, Loader2, Search, FileText } from 'lucide-react';

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up',
  TREND_ANALYSIS: 'Trend Analysis',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
};

export default function DoctorCasesPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'opinion_written'>('all');
  const [search, setSearch] = useState('');
  const { data: cases, isLoading } = useDoctorCases();

  const filtered = (cases ?? [])
    .filter((c: any) => {
      if (filter === 'pending') return !c.opinions || c.opinions.length === 0 || c.opinions[0].status === 'DRAFT';
      if (filter === 'opinion_written') return c.opinions && c.opinions.length > 0 && c.opinions[0].status !== 'DRAFT';
      return true;
    })
    .filter((c: any) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.patient.name?.toLowerCase().includes(q) ||
        c.patient.email.toLowerCase().includes(q) ||
        c.serviceType.toLowerCase().includes(q)
      );
    });

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="font-headline-md text-xl md:text-2xl font-semibold text-text-medical-black">
          My Cases
        </h1>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          Cases assigned to you for review.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy"
          />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {([
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'opinion_written', label: 'Opinion Written' },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f.key
                  ? 'bg-clinical-navy text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-gray p-12 text-center">
          <Briefcase className="size-10 text-on-surface-variant/30 mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm">No cases found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any) => {
            const s = statusConfig[c.status] || statusConfig.OPEN;
            const hasOpinion = c.opinions && c.opinions.length > 0 && c.opinions[0].status !== 'DRAFT';
            return (
              <Link
                key={c.id}
                href={`/doctor/cases/${c.id}`}
                className="block bg-white rounded-xl border border-surface-gray/60 shadow-sm p-4 hover:shadow-md hover:border-clinical-navy/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-text-medical-black text-sm">
                        {c.patient.name ?? 'Unknown Patient'}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-xs">
                      {serviceTypeLabels[c.serviceType] || c.serviceType}
                    </p>
                    <p className="text-on-surface-variant/60 text-[11px] mt-1">
                      Created {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasOpinion ? (
                      <span className="inline-flex items-center gap-1 text-healing-teal text-xs font-medium">
                        <FileText className="size-3.5" />
                        Opinion signed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                        <FileText className="size-3.5" />
                        Pending review
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add My Cases nav item to doctor layout**

In `components/DoctorLayout.tsx`, add a new nav item after "Dashboard":

```tsx
<li>
  <Link href="/doctor/cases" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
    <Briefcase className="size-4" />
    <span>My Cases</span>
  </Link>
</li>
```

Import `Briefcase` from lucide-react at the top:

```tsx
import { Stethoscope, LayoutDashboard, Users, Calendar, FlaskConical, Plus, HelpCircle, LogOut, Menu, Bell, Briefcase } from 'lucide-react';
```

- [ ] **Step 5: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/doctor/cases` — should show assigned cases with status and opinion status
Test: Click a case → navigates to `/doctor/cases/[id]`

- [ ] **Step 6: Commit**

```bash
git add app/doctor/cases/ lib/hooks/use-doctor-cases.ts lib/hooks/index.ts components/DoctorLayout.tsx
git commit -m "feat: add doctor My Cases list page with filtering"
```

---

### Task 8: Doctor Case Review & Opinion API

**Files:**
- Create: `app/api/doctor/cases/[id]/opinion/route.ts`

**Interfaces:**
- Consumes: SpecialistOpinion model, Case model
- Produces: GET/POST /api/doctor/cases/[id]/opinion

- [ ] **Step 1: Create opinion API route**

Create `app/api/doctor/cases/[id]/opinion/route.ts`:

```typescript
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

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const opinion = await prisma.specialistOpinion.findFirst({
    where: { caseId: id, specialistId: userId },
    include: { specialist: { select: { name: true } } },
  });

  return NextResponse.json(opinion || null);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  // Verify case is assigned to this doctor
  const caseRecord = await prisma.case.findFirst({
    where: { id, specialistId: userId },
  });
  if (!caseRecord) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  // Check if opinion already exists and is signed
  const existing = await prisma.specialistOpinion.findFirst({
    where: { caseId: id, specialistId: userId },
  });

  if (existing && existing.status === 'SIGNED') {
    return NextResponse.json({ error: 'Opinion already signed and cannot be edited' }, { status: 400 });
  }

  const opinionData = {
    content: body.content,
    status: body.sign ? 'SIGNED' : 'DRAFT',
    signedAt: body.sign ? new Date() : null,
  };

  let opinion;
  if (existing) {
    opinion = await prisma.specialistOpinion.update({
      where: { id: existing.id },
      data: opinionData,
    });
  } else {
    opinion = await prisma.specialistOpinion.create({
      data: {
        caseId: id,
        specialistId: userId,
        ...opinionData,
      },
    });
  }

  // If signed, transition case status to OPINION_READY
  if (body.sign) {
    await prisma.case.update({
      where: { id },
      data: { status: 'OPINION_READY' },
    });
  }

  return NextResponse.json(opinion);
}
```

- [ ] **Step 2: Test the API**

Run: `npx next dev --turbopack`
Test: Login as doctor, create a draft opinion via POST
Test: Sign the opinion via POST with `sign: true`
Test: Verify case status changed to OPINION_READY
Test: Try to update signed opinion — should return 400 error

- [ ] **Step 3: Commit**

```bash
git add app/api/doctor/cases/[id]/opinion/
git commit -m "feat: add doctor opinion API with draft and sign workflow"
```

---

### Task 9: Doctor Case Review Page

**Files:**
- Create: `app/doctor/cases/[id]/page.tsx`

**Interfaces:**
- Consumes: useDoctorCase, useSubmitOpinion hooks (Task 7), GET/POST /api/doctor/cases/[id]/opinion (Task 8)
- Produces: /doctor/cases/[id] page

- [ ] **Step 1: Create case review page**

Create `app/doctor/cases/[id]/page.tsx`:

```tsx
"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle, User, Calendar, Loader2, Save, Send } from 'lucide-react';
import { useDoctorCase, useSubmitOpinion } from '@/lib/hooks/use-doctor-cases';

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
};

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseOpinionSections(content: string) {
  const sections = content.split(/^## /m).filter(Boolean);
  return sections.map((section) => {
    const [title, ...body] = section.split('\n');
    return { title: title.trim(), body: body.join('\n').trim() };
  });
}

export default function DoctorCaseReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: caseData, isLoading } = useDoctorCase(id);
  const submitOpinion = useSubmitOpinion();

  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [showSignConfirm, setShowSignConfirm] = useState(false);

  const existingOpinion = caseData?.opinions?.[0];
  const isSigned = existingOpinion?.status === 'SIGNED' || existingOpinion?.status === 'DELIVERED';
  const isDraft = existingOpinion?.status === 'DRAFT';

  // Load existing draft into form
  useEffect(() => {
    if (existingOpinion?.content) {
      const sections = parseOpinionSections(existingOpinion.content);
      for (const section of sections) {
        if (section.title.toLowerCase().includes('finding')) setFindings(section.body);
        else if (section.title.toLowerCase().includes('impression')) setImpression(section.body);
        else if (section.title.toLowerCase().includes('next step')) setNextSteps(section.body);
      }
    }
  }, [existingOpinion]);

  const buildContent = () => {
    return `## Clinical Findings\n${findings}\n\n## Impression\n${impression}\n\n## Recommended Next Steps\n${nextSteps}`;
  };

  const handleSaveDraft = async () => {
    await submitOpinion.mutateAsync({
      caseId: id,
      content: buildContent(),
      sign: false,
    });
  };

  const handleSign = async () => {
    await submitOpinion.mutateAsync({
      caseId: id,
      content: buildContent(),
      sign: true,
    });
    setShowSignConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-healing-teal" size={32} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-on-surface-variant">Case not found</p>
        <Link href="/doctor/cases" className="text-clinical-navy text-sm mt-2 inline-block hover:text-healing-teal">
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.OPEN;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 md:pb-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/doctor/cases"
          className="inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-clinical-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-semibold text-text-medical-black">
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Patient: {caseData.patient.name ?? 'Unknown'} &middot; Created {formatDate(caseData.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* Uploaded Records */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
      >
        <h2 className="font-semibold text-text-medical-black mb-3 flex items-center gap-2">
          <FileText className="size-4 text-clinical-navy" />
          Uploaded Records ({caseData.records?.length || 0})
        </h2>
        {caseData.records && caseData.records.length > 0 ? (
          <ul className="space-y-2">
            {caseData.records.map((record: any) => (
              <li key={record.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <FileText className="size-4 text-on-surface-variant" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-medical-black truncate">{record.fileName}</p>
                  <p className="text-xs text-on-surface-variant">{record.fileType} &middot; {formatDate(record.uploadedAt)}</p>
                </div>
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clinical-navy hover:text-healing-teal font-medium"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-on-surface-variant text-sm">No records uploaded yet.</p>
        )}
      </motion.div>

      {/* AI Pre-screen */}
      {caseData.aiPrescreens && caseData.aiPrescreens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-evidence-blue-light/30 to-surface border border-evidence-blue-light/60 rounded-2xl shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-2 flex items-center gap-2">
            <span className="size-2 bg-clinical-navy rounded-full" />
            AI Pre-screen
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {caseData.aiPrescreens[0].findings}
          </p>
          {caseData.aiPrescreens[0].urgentFlags && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700 text-sm font-medium">Urgent Flags</p>
              <p className="text-amber-600 text-sm mt-1">{caseData.aiPrescreens[0].urgentFlags}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Opinion Form or Signed Opinion Display */}
      {isSigned ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-healing-teal" />
            Signed Opinion
          </h2>
          <div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
            <Calendar className="size-3" />
            Signed {existingOpinion.signedAt ? formatDate(existingOpinion.signedAt) : 'Unknown date'}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(existingOpinion.content).map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-clinical-navy mb-1">{section.title}</h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6 space-y-5"
        >
          <h2 className="font-semibold text-text-medical-black flex items-center gap-2">
            <FileText className="size-4 text-clinical-navy" />
            Write Your Opinion
          </h2>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Clinical Findings <span className="text-red-500">*</span>
            </label>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Describe your clinical findings from the reviewed materials..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Impression <span className="text-red-500">*</span>
            </label>
            <textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Your clinical impression and assessment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Recommended Next Steps <span className="text-red-500">*</span>
            </label>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Recommended next steps for the patient..."
            />
          </div>

          {submitOpinion.isError && (
            <p className="text-red-500 text-sm">{submitOpinion.error.message}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveDraft}
              disabled={submitOpinion.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save as Draft
            </button>

            {showSignConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant">Confirm signature?</span>
                <button
                  onClick={handleSign}
                  disabled={submitOpinion.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-clinical-navy rounded-lg hover:bg-clinical-navy/90 transition-colors disabled:opacity-50"
                >
                  {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Sign & Submit
                </button>
                <button
                  onClick={() => setShowSignConfirm(false)}
                  className="text-sm text-on-surface-variant hover:text-error"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignConfirm(true)}
                disabled={!findings.trim() || !impression.trim() || !nextSteps.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-healing-teal rounded-lg hover:bg-healing-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-4" />
                Sign & Submit
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/doctor/cases/[id]` — should show case detail with records, AI prescreen, opinion form
Test: Fill in all three fields → "Sign & Submit" → confirmation → opinion signed, case status changes to OPINION_READY
Test: "Save as Draft" → opinion saved as draft
Test: Reload page → draft loads into form fields

- [ ] **Step 3: Commit**

```bash
git add app/doctor/cases/[id]/page.tsx
git commit -m "feat: add doctor case review page with structured opinion form"
```

---

### Task 10: Patient Report Delivery Update

**Files:**
- Modify: `app/patient/cases/[id]/page.tsx`

**Interfaces:**
- Consumes: caseData.opinions with parsed markdown content
- Produces: Updated opinion display with parsed sections

- [ ] **Step 1: Add parseOpinionSections helper and update opinion display**

In `app/patient/cases/[id]/page.tsx`, add a helper function after the `formatDate` function:

```typescript
function parseOpinionSections(content: string) {
  const sections = content.split(/^## /m).filter(Boolean);
  return sections.map((section) => {
    const [title, ...body] = section.split('\n');
    return { title: title.trim(), body: body.join('\n').trim() };
  });
}
```

Replace the opinions section (lines 167-205) with:

```tsx
{/* Opinions */}
{caseData.opinions && caseData.opinions.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="space-y-4"
  >
    <h2 className="font-semibold text-text-medical-black flex items-center gap-2">
      <CheckCircle2 className="size-4 text-clinical-navy" />
      Specialist Opinions
    </h2>
    {caseData.opinions
      .filter((opinion: any) => opinion.status === 'SIGNED' || opinion.status === 'DELIVERED')
      .map((opinion: any) => (
        <div key={opinion.id} className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-clinical-navy">{opinion.specialist?.name}</p>
              <p className="text-xs text-on-surface-variant">Board-Certified Specialist</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                opinion.status === 'DELIVERED' ? 'bg-healing-teal/10 text-healing-teal' :
                opinion.status === 'SIGNED' ? 'bg-blue-50 text-blue-600' :
                'bg-gray-100 text-gray-500'
              }`}>
                {opinion.status}
              </span>
              {opinion.signedAt && (
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDate(opinion.signedAt)}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {parseOpinionSections(opinion.content).map((section: any, i: number) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-clinical-navy mb-1">{section.title}</h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
  </motion.div>
)}
```

- [ ] **Step 2: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/patient/cases/[id]` — should show signed opinions with parsed sections (Findings, Impression, Next Steps)
Test: Verify DRAFT opinions are filtered out
Test: Verify sections render with proper headings

- [ ] **Step 3: Commit**

```bash
git add app/patient/cases/\[id\]/page.tsx
git commit -m "feat: update patient case detail to display parsed opinion sections"
```

---

### Task 11: Final Navigation & Layout Updates

**Files:**
- Modify: `app/admin/layout.tsx` (already updated in Task 3)
- Modify: `app/doctor/layout.tsx` (already updated in Task 7)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Complete navigation for admin and doctor portals

- [ ] **Step 1: Verify admin layout has all nav items**

Check `app/admin/layout.tsx` has:
- News (existing)
- Specialists (added in Task 3)
- Cases (added in Task 3)
- View Site (existing)

- [ ] **Step 2: Verify doctor layout has all nav items**

Check `components/DoctorLayout.tsx` has:
- Dashboard (existing)
- My Cases (added in Task 7)
- Patients (existing)
- Schedule (existing)
- Lab Reviews (existing)

- [ ] **Step 3: Test all navigation links**

Run: `npx next dev --turbopack`
Test: Click each nav item in admin portal → pages load correctly
Test: Click each nav item in doctor portal → pages load correctly

- [ ] **Step 4: Commit**

```bash
git add app/admin/layout.tsx components/DoctorLayout.tsx
git commit -m "chore: verify navigation items for admin and doctor portals"
```

---

### Task 12: End-to-End Flow Test

**Files:**
- None (verification task)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Verified end-to-end flow

- [ ] **Step 1: Test admin verification flow**

1. Login as admin
2. Navigate to `/admin/specialists`
3. Find an unverified doctor
4. Click "Unverified" → Confirm → status changes to "Verified"

- [ ] **Step 2: Test admin case routing flow**

1. Navigate to `/admin/cases`
2. Find an OPEN case (unassigned)
3. Click "Assign" → select verified specialist → confirm
4. Case status changes to "UNDER_REVIEW"

- [ ] **Step 3: Test doctor case review flow**

1. Login as the assigned doctor
2. Navigate to `/doctor/cases`
3. See the assigned case with "Pending review" status
4. Click case → opens case review page
5. View uploaded records
6. Fill in Clinical Findings, Impression, Recommended Next Steps
7. Click "Save as Draft" → opinion saved as draft
8. Click "Sign & Submit" → Confirm → opinion signed, case status changes to "OPINION_READY"

- [ ] **Step 4: Test patient report delivery flow**

1. Login as the patient
2. Navigate to `/patient/cases/[id]`
3. See the signed specialist opinion with parsed sections (Findings, Impression, Next Steps)
4. Verify specialist name and signed date displayed

- [ ] **Step 5: Run lint and typecheck**

Run: `npx next lint`
Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: Phase 2 specialist portal complete — verification, routing, opinions, reports"
```
