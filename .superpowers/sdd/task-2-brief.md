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
