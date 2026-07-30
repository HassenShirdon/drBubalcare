import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';

const verifySchema = z.object({
  verified: z.boolean(),
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

  const body = await request.json();
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

  const updated = await prisma.doctor.update({
    where: { id },
    data: { verified: parsed.data.verified },
  });

  logAuditEvent({
    userId: session.user.id,
    action: AUDIT_ACTIONS.SPECIALIST_VERIFIED,
    resourceType: 'Doctor',
    resourceId: id,
    after: { verified: parsed.data.verified },
  });

  return NextResponse.json(updated);
}
