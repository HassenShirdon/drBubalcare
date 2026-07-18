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
