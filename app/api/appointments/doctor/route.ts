import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      date: { gte: today, lt: tomorrow },
    },
    include: {
      patient: { select: { name: true, email: true, image: true } },
    },
    orderBy: { time: 'asc' },
  });

  return NextResponse.json(appointments);
}
