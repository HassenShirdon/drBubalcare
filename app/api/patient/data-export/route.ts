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
