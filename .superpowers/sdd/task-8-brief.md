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
