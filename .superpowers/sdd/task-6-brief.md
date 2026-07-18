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
