import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import {
  Calendar,
  FlaskConical,
  UserSearch,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

async function getUpcomingAppointments(userId: string) {
  return prisma.appointment.findMany({
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
    take: 3,
  });
}

async function getRecentLabResults(userId: string) {
  return prisma.labResult.findMany({
    where: { patientId: userId },
    orderBy: { date: 'desc' },
    take: 3,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const QUICK_ACTIONS = [
  {
    href: '/patient/cases/new',
    title: 'Start a case',
    description: 'Get a written specialist opinion',
    icon: FileText,
  },
  {
    href: '/directory',
    title: 'Book an appointment',
    description: 'Find a physician near you',
    icon: Calendar,
  },
  {
    href: '/patient/labs',
    title: 'Upload lab reports',
    description: 'Submit results for interpretation',
    icon: FlaskConical,
  },
  {
    href: '/directory',
    title: 'Browse the directory',
    description: 'Explore the physician network',
    icon: UserSearch,
  },
];

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;
  const userName = session.user?.name ?? 'Patient';

  const [appointments, labResults] = await Promise.all([
    getUpcomingAppointments(userId),
    getRecentLabResults(userId),
  ]);

  const aiSummary = labResults.find((l) => l.aiInterpretation)?.aiInterpretation;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-pulse-navy md:text-3xl">
          Welcome back, {userName.split(' ')[0]}
        </h2>
        <p className="mt-1 text-sm text-pulse-text-secondary">Here is your health overview.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-pulse-border bg-pulse-surface p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-pulse-navy">
                <Calendar className="size-4 text-pulse-info" aria-hidden="true" />
                Upcoming appointments
              </h3>
            </div>

            {appointments.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto mb-2 size-10 text-pulse-text-muted" aria-hidden="true" />
                <p className="text-sm text-pulse-text-secondary">No appointments scheduled.</p>
                <Link
                  href="/directory"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-pulse-info hover:text-pulse-info/80"
                >
                  Book an appointment
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {appointments.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center gap-4 rounded-lg bg-pulse-surface-elevated p-3"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pulse-navy-light text-sm font-semibold text-pulse-navy">
                      {apt.doctor.user.name?.charAt(0) ?? 'D'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-pulse-text-primary">
                        {apt.doctor.user.name}
                      </p>
                      <p className="text-xs text-pulse-text-muted">
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                    </div>
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-pulse-success-light text-pulse-success'
                          : 'bg-pulse-info-light text-pulse-info'
                      }`}
                    >
                      {apt.status.toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-pulse-border bg-pulse-surface p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-pulse-navy">
                <FlaskConical className="size-4 text-pulse-info" aria-hidden="true" />
                Recent lab results
              </h3>
              <Link
                href="/patient/labs"
                className="text-sm font-medium text-pulse-info hover:text-pulse-info/80"
              >
                View all
              </Link>
            </div>

            {labResults.length === 0 ? (
              <div className="py-8 text-center">
                <FlaskConical className="mx-auto mb-2 size-10 text-pulse-text-muted" aria-hidden="true" />
                <p className="text-sm text-pulse-text-secondary">No lab results yet.</p>
                <Link
                  href="/patient/labs"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-pulse-info hover:text-pulse-info/80"
                >
                  Upload your first lab report
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {labResults.map((lab) => (
                  <li key={lab.id}>
                    <Link
                      href={`/patient/labs/${lab.id}`}
                      className="flex items-center gap-4 rounded-lg bg-pulse-surface-elevated p-3 transition-colors hover:bg-pulse-border/60"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pulse-info-light">
                        {lab.status === 'NORMAL' ? (
                          <CheckCircle2 className="size-5 text-pulse-success" aria-hidden="true" />
                        ) : (
                          <AlertCircle className="size-5 text-pulse-warning" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-pulse-text-primary">
                          {lab.name}
                        </p>
                        <p className="text-xs text-pulse-text-muted">{formatDate(lab.date)}</p>
                      </div>
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          lab.status === 'NORMAL'
                            ? 'bg-pulse-success-light text-pulse-success'
                            : 'bg-pulse-warning-light text-pulse-warning'
                        }`}
                      >
                        {lab.status === 'NORMAL' ? 'Normal' : 'Review needed'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-pulse-border bg-pulse-surface p-6 shadow-soft">
            <h3 className="mb-4 font-semibold text-pulse-navy">Quick actions</h3>
            <div className="space-y-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg bg-pulse-surface-elevated p-3 transition-colors hover:bg-pulse-border/60"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-pulse-info-light text-pulse-info">
                    <action.icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-pulse-text-primary">{action.title}</p>
                    <p className="text-xs text-pulse-text-muted">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {aiSummary && (
            <section className="rounded-xl border border-pulse-info/30 bg-pulse-info-light p-6">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="size-4 text-pulse-info" aria-hidden="true" />
                <h3 className="font-semibold text-pulse-navy">AI-generated draft</h3>
              </div>
              <p className="text-sm leading-relaxed text-pulse-text-secondary">{aiSummary}</p>
              <p className="mt-3 text-xs text-pulse-text-muted">
                This is an AI draft, not a diagnosis. A board-certified physician reviews all
                findings before they are final.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
