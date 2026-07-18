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
