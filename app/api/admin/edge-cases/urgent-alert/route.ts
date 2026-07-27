import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notifyAdmin, notifyPatient, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import { z } from 'zod';

const urgentAlertSchema = z.object({
  caseId: z.string().min(1, 'caseId is required'),
  message: z.string().min(1, 'message is required').max(2000, 'message too long'),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const parsed = urgentAlertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { caseId, message } = parsed.data;

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
