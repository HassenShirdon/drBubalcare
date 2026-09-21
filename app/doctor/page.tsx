import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Calendar, FlaskConical, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

async function getDoctorProfile(userId: string) {
  return prisma.doctor.findUnique({
    where: { userId },
    include: { user: { select: { name: true, image: true } } },
  });
}

async function getTodayAppointments(doctorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: today, lt: tomorrow },
    },
    include: {
      patient: { select: { name: true, age: true, gender: true } },
    },
    orderBy: { time: 'asc' },
  });
}

async function getAppointmentCount(doctorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.appointment.count({
    where: { doctorId, date: { gte: today } },
  });
}

async function getPendingLabReviews() {
  return prisma.labResult.findMany({
    where: { status: 'REVIEW_NEEDED' },
    include: {
      patient: { select: { name: true, email: true } },
      metrics: true,
    },
    orderBy: { date: 'desc' },
    take: 10,
  });
}

async function getPatientCount(doctorId: string) {
  const result = await prisma.appointment.groupBy({
    by: ['patientId'],
    where: { doctorId },
  });
  return result.length;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function DoctorDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;

  const doctor = await getDoctorProfile(userId);
  if (!doctor) redirect('/auth/signin');

  const [appointments, pendingReviews, appointmentCount, patientCount] = await Promise.all([
    getTodayAppointments(doctor.id),
    getPendingLabReviews(),
    getAppointmentCount(doctor.id),
    getPatientCount(doctor.id),
  ]);

  const pendingReviewCount = pendingReviews.length;

  const stats = [
    { label: 'Total appointments', value: appointmentCount, icon: Calendar, tone: 'info' as const },
    { label: 'Total patients', value: patientCount, icon: Users, tone: 'success' as const },
    { label: 'Pending reviews', value: pendingReviewCount, icon: FlaskConical, tone: 'warning' as const },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6 lg:p-8">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-pulse-navy md:text-2xl">
          Welcome back, Dr. {doctor.user.name ?? 'Doctor'}
        </h2>
        <p className="mt-0.5 text-sm text-pulse-text-secondary">
          {doctor.specialty} &middot; {doctor.experience}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-pulse-border bg-pulse-surface p-5 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${
                  stat.tone === 'info'
                    ? 'bg-pulse-info-light text-pulse-info'
                    : stat.tone === 'success'
                      ? 'bg-pulse-success-light text-pulse-success'
                      : 'bg-pulse-warning-light text-pulse-warning'
                }`}
              >
                <stat.icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold tabular-nums text-pulse-text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-pulse-text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-pulse-border bg-pulse-surface p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-pulse-navy">
              <Calendar className="size-4 text-pulse-info" aria-hidden="true" />
              Today&apos;s schedule
            </h3>
            <span className="text-xs text-pulse-text-muted">{formatDate(new Date())}</span>
          </div>

          {appointments.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-3 size-12 text-pulse-text-muted" aria-hidden="true" />
              <p className="text-sm font-semibold text-pulse-text-primary">No appointments today</p>
              <p className="mt-1 text-xs text-pulse-text-muted">
                Your schedule will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {appointments.map((apt) => (
                <li
                  key={apt.id}
                  className="flex items-center gap-3 rounded-lg bg-pulse-surface-elevated p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pulse-navy-light text-xs font-semibold text-pulse-navy">
                    {apt.patient.name?.charAt(0) ?? 'P'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-pulse-text-primary">
                      {apt.patient.name ?? 'Unknown patient'}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-pulse-text-muted">
                      <Clock className="size-3" aria-hidden="true" />
                      {formatTime(apt.time)}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-medium capitalize ${
                      apt.status === 'CONFIRMED'
                        ? 'bg-pulse-success-light text-pulse-success'
                        : apt.status === 'SCHEDULED'
                          ? 'bg-pulse-info-light text-pulse-info'
                          : 'bg-pulse-surface-elevated text-pulse-text-muted'
                    }`}
                  >
                    {apt.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-pulse-border bg-pulse-surface p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-pulse-navy">
              <FlaskConical className="size-4 text-pulse-info" aria-hidden="true" />
              Pending lab reviews
            </h3>
            <Link
              href="/doctor/labs/review"
              className="text-xs font-medium text-pulse-info transition-colors hover:text-pulse-info/80"
            >
              View all
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2
                className="mx-auto mb-3 size-12 text-pulse-success opacity-50"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-pulse-text-primary">All labs reviewed</p>
              <p className="mt-1 text-xs text-pulse-text-muted">
                No pending reviews at this time.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {pendingReviews.map((lab) => {
                const flagged = lab.metrics.filter((m) => m.status !== 'NORMAL').length;
                return (
                  <li
                    key={lab.id}
                    className="flex items-center gap-3 rounded-lg bg-pulse-surface-elevated p-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pulse-warning-light text-pulse-warning">
                      <AlertCircle className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-pulse-text-primary">
                        {lab.name}
                      </p>
                      <p className="text-xs text-pulse-text-muted">
                        {lab.patient.name ?? 'Unknown'} &middot; {formatDate(lab.date)}
                      </p>
                    </div>
                    <span className="rounded-md bg-pulse-warning-light px-2.5 py-0.5 text-xs font-medium tabular-nums text-pulse-warning">
                      {flagged} flag{flagged !== 1 ? 's' : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
