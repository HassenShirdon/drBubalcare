import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: {
      patient: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { date: 'desc' },
  });

  const patientMap = new Map<string, {
    id: string;
    name: string;
    email: string;
    image: string | null;
    appointmentCount: number;
    lastVisit: Date;
  }>();

  for (const apt of appointments) {
    const existing = patientMap.get(apt.patientId);
    if (existing) {
      existing.appointmentCount++;
      if (apt.date > existing.lastVisit) existing.lastVisit = apt.date;
    } else {
      patientMap.set(apt.patientId, {
        id: apt.patient.id,
        name: apt.patient.name ?? 'Unknown',
        email: apt.patient.email,
        image: apt.patient.image,
        appointmentCount: 1,
        lastVisit: apt.date,
      });
    }
  }

  const patients = Array.from(patientMap.values()).sort(
    (a, b) => b.lastVisit.getTime() - a.lastVisit.getTime()
  );

  return NextResponse.json(patients, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
