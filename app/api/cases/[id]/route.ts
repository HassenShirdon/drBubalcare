import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const caseRecord = await prisma.case.findUnique({
    where: { id },
    include: {
      patient: { select: { name: true, email: true } },
      specialist: { select: { name: true, email: true } },
      records: true,
      opinions: {
        where: { status: { in: ['SIGNED', 'DELIVERED'] } },
        include: { specialist: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      aiPrescreens: {
        orderBy: { generatedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (role === 'PATIENT' && caseRecord.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (role === 'DOCTOR' && caseRecord.specialistId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(caseRecord);
}
