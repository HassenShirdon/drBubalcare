import { prisma } from '@/lib/db';
import { requireDoctor, serverError, notFound, ok } from '@/lib/api-helpers';

export async function GET() {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const doctor = await prisma.doctor.findUnique({ where: { userId: auth.userId } });
    if (!doctor) return notFound('Doctor profile');

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: { select: { id: true, name: true, age: true, gender: true } },
      },
      orderBy: { date: 'desc' },
      take: 500,
    });

    const patientMap = new Map<string, {
      id: string;
      name: string;
      age: number | null;
      gender: string | null;
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
          age: apt.patient.age,
          gender: apt.patient.gender,
          appointmentCount: 1,
          lastVisit: apt.date,
        });
      }
    }

    const patients = Array.from(patientMap.values()).sort(
      (a, b) => b.lastVisit.getTime() - a.lastVisit.getTime()
    );

    return ok(patients, 'private, no-store');
  } catch (error) {
    return serverError(error);
  }
}
