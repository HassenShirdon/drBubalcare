import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';

const assignSchema = z.object({
  specialistId: z.string().min(1, 'specialistId is required').nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid or empty request body' }, { status: 400 });
  }
  const parsed = assignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const caseRecord = await prisma.case.findUnique({ where: { id } });
  if (!caseRecord) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  // Verify the specialist exists and is verified
  if (parsed.data.specialistId) {
    const doctor = await prisma.doctor.findFirst({
      where: { userId: parsed.data.specialistId, verified: true },
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Specialist not found or not verified' }, { status: 400 });
    }
  }

  // Atomic conditional update: the where clause re-checks the case status at
  // the database level, so a concurrent transition to CLOSED/DISPUTED between
  // the lookup above and this write cannot produce an invalid assignment
  // (TOCTOU race) — updateMany returns count 0 if the guard fails.
  const result = await prisma.case.updateMany({
    where: { id, status: { notIn: ['CLOSED', 'DISPUTED'] } },
    data: {
      specialistId: parsed.data.specialistId || null,
      status: parsed.data.specialistId ? 'UNDER_REVIEW' : 'OPEN',
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: 'Case is closed or disputed and cannot be reassigned' },
      { status: 400 }
    );
  }

  const updated = await prisma.case.findUniqueOrThrow({ where: { id } });

  logAuditEvent({
    userId: session.user.id,
    action: AUDIT_ACTIONS.CASE_ASSIGN_SPECIALIST,
    resourceType: 'Case',
    resourceId: id,
    after: { specialistId: parsed.data.specialistId, status: updated.status },
  });

  return NextResponse.json(updated);
}
