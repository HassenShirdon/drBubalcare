import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: userId,
      date: { gte: new Date() },
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
    include: {
      doctor: {
        include: {
          user: { select: { name: true, image: true } },
        },
      },
    },
    orderBy: { date: 'asc' },
    take: 5,
  });

  return NextResponse.json(appointments);
}
