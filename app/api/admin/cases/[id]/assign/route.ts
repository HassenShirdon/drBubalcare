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
