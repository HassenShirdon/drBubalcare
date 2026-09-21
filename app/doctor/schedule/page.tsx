import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Calendar, Clock } from 'lucide-react';

async function getDoctor(userId: string) {
  return prisma.doctor.findUnique({ where: { userId } });
}

async function getAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where: { doctorId },
    include: {
      patient: { select: { name: true, age: true, gender: true } },
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    take: 50,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function groupByDate(appointments: Awaited<ReturnType<typeof getAppointments>>) {
  const groups = new Map<string, typeof appointments>();
  for (const apt of appointments) {
    const key = apt.date.toISOString().split('T')[0];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(apt);
  }
  return groups;
}

const STATUS_BADGE: Record<string, string> = {
  SCHEDULED: 'bg-pulse-info-light text-pulse-navy',
  CONFIRMED: 'bg-pulse-success-light text-pulse-success',
  IN_PROGRESS: 'bg-pulse-warning-light text-pulse-warning',
  COMPLETED: 'bg-pulse-surface-elevated text-pulse-text-muted',
  CANCELLED: 'bg-pulse-red-light text-pulse-red',
};

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;
  const doctor = await getDoctor(userId);
  if (!doctor) redirect('/auth/signin');

  const appointments = await getAppointments(doctor.id);
  const grouped = groupByDate(appointments);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-pulse-navy">Schedule</h2>
        <p className="mt-0.5 text-sm text-pulse-text-secondary">
          {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
        </p>
      </header>

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-pulse-border bg-pulse-surface p-12 text-center shadow-soft">
          <Calendar className="mx-auto mb-3 size-12 text-pulse-text-muted" aria-hidden="true" />
          <p className="text-base font-semibold text-pulse-text-primary">No appointments</p>
          <p className="mt-1 text-sm text-pulse-text-secondary">
            Your schedule will appear here once appointments are booked.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([dateKey, dayAppts]) => (
            <section key={dateKey}>
              <h3 className="mb-3 border-b border-pulse-border pb-2 text-sm font-semibold text-pulse-navy">
                {formatDate(new Date(dateKey + 'T00:00:00'))}
              </h3>
              <div className="space-y-2">
                {dayAppts.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 rounded-xl border border-pulse-border bg-pulse-surface p-4 shadow-soft transition-colors hover:border-pulse-border-strong"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pulse-info-light text-sm font-semibold text-pulse-info">
                      {apt.patient.name?.charAt(0) ?? 'P'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-pulse-text-primary">
                        {apt.patient.name ?? 'Unknown patient'}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-pulse-text-secondary">
                        <Clock className="size-3" aria-hidden="true" />
                        {formatTime(apt.time)}
                      </p>
                    </div>
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-medium capitalize ${
                        STATUS_BADGE[apt.status] ?? STATUS_BADGE.COMPLETED
                      }`}
                    >
                      {apt.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
