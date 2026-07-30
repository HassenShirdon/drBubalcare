import { prisma } from '@/lib/db';
import { requireDoctor, serverError, notFound, ok } from '@/lib/api-helpers';

export async function GET() {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const doctor = await prisma.doctor.findUnique({ where: { userId: auth.userId } });
    if (!doctor) return notFound('Doctor profile');

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
        patient: { select: { name: true, age: true, gender: true } },
      },
      orderBy: { time: 'asc' },
      take: 200,
    });

    return ok(appointments, 'private, no-store');
  } catch (error) {
    return serverError(error);
  }
}
