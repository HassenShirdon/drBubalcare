import { prisma } from '@/lib/db';
import { requireDoctor, serverError, notFound, ok } from '@/lib/api-helpers';

export async function GET() {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const doctor = await prisma.doctor.findUnique({ where: { userId: auth.userId } });
    if (!doctor) return notFound('Doctor profile');

    // Aggregate distinct patients with two bounded queries instead of loading
    // up to 500 full appointment rows (each with a patient include) into memory.
    const grouped = await prisma.appointment.groupBy({
      by: ['patientId'],
      where: { doctorId: doctor.id },
      _count: { patientId: true },
      _max: { date: true },
    });

    const patientIds = grouped.map((g) => g.patientId);
    const users = patientIds.length
      ? await prisma.user.findMany({
          where: { id: { in: patientIds } },
          select: { id: true, name: true, age: true, gender: true },
        })
      : [];
    const userById = new Map(users.map((u) => [u.id, u]));

    const patients = grouped
      .map((g) => {
        const user = userById.get(g.patientId);
        if (!user) return null;
        return {
          id: user.id,
          name: user.name ?? 'Unknown',
          age: user.age,
          gender: user.gender,
          appointmentCount: g._count.patientId,
          lastVisit: g._max.date ?? new Date(0),
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime());

    return ok(patients, 'private, no-store');
  } catch (error) {
    return serverError(error);
  }
}
