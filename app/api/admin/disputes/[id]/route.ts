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

  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      case: { select: { id: true, serviceType: true, description: true } },
      patient: { select: { name: true, email: true } },
      opinion: {
        include: { specialist: { select: { name: true, email: true } } },
      },
      peerReviewOpinion: {
        include: { specialist: { select: { name: true, email: true } } },
      },
    },
  });

  if (!dispute) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(dispute);
}
