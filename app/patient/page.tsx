import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Calendar, FlaskConical, UserSearch, ArrowRight, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

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

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;
  const userName = session.user?.name ?? 'Patient';

  const [appointments, labResults] = await Promise.all([
    getUpcomingAppointments(userId),
    getRecentLabResults(userId),
  ]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1E3A5F' }}>
          Welcome back, {userName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
          Here is your health overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg shadow-sm p-6" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2" style={{ color: '#1E3A5F' }}>
                <Calendar className="size-4" style={{ color: '#3B82F6' }} />
                Upcoming Appointments
              </h2>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="size-10 mx-auto mb-2" style={{ color: '#64748B' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>No upcoming appointments</p>
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-1 mt-3 font-medium text-sm"
                  style={{ color: '#3B82F6' }}
                >
                  Book an appointment <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {appointments.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center gap-4 p-3 rounded-lg transition-colors"
                    style={{ background: '#F1F5F9' }}
                  >
                    <div className="size-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                      {apt.doctor.user.name?.charAt(0) ?? 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: '#0F172A' }}>
                        {apt.doctor.user.name}
                      </p>
                      <p className="text-xs" style={{ color: '#64748B' }}>
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                      style={
                        apt.status === 'CONFIRMED'
                          ? { background: '#DCFCE7', color: '#15803D' }
                          : { background: '#DBEAFE', color: '#1E40AF' }
                      }
                    >
                      {apt.status.toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg shadow-sm p-6" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2" style={{ color: '#1E3A5F' }}>
                <FlaskConical className="size-4" style={{ color: '#3B82F6' }} />
                Recent Lab Results
              </h2>
              <Link
                href="/patient/labs"
                className="text-sm font-medium"
                style={{ color: '#3B82F6' }}
              >
                View all
              </Link>
            </div>

            {labResults.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="size-10 mx-auto mb-2" style={{ color: '#64748B' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>No lab results yet</p>
                <Link
                  href="/patient/labs"
                  className="inline-flex items-center gap-1 mt-3 font-medium text-sm"
                  style={{ color: '#3B82F6' }}
                >
                  Upload your first lab report <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {labResults.map((lab) => (
                  <li key={lab.id}>
                    <Link
                      href={`/patient/labs/${lab.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg transition-colors"
                      style={{ background: '#F1F5F9' }}
                    >
                      <div className="size-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#DBEAFE' }}>
                        {lab.status === 'NORMAL' ? (
                          <CheckCircle2 className="size-5" style={{ color: '#22C55E' }} />
                        ) : (
                          <AlertCircle className="size-5" style={{ color: '#F59E0B' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: '#0F172A' }}>{lab.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{formatDate(lab.date)}</p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={
                          lab.status === 'NORMAL'
                            ? { background: '#DCFCE7', color: '#15803D' }
                            : { background: '#FEF3C7', color: '#B45309' }
                        }
                      >
                        {lab.status === 'NORMAL' ? 'Normal' : 'Review'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg shadow-sm p-6" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <h2 className="font-semibold mb-4" style={{ color: '#1E3A5F' }}>Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/patient/cases/new"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{ background: '#F1F5F9' }}
              >
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                  <FileText className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#0F172A' }}>Start a Case</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Get a specialist opinion</p>
                </div>
              </Link>
              <Link
                href="/directory"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{ background: '#F1F5F9' }}
              >
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#0F172A' }}>Book Appointment</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Find a specialist</p>
                </div>
              </Link>
              <Link
                href="/patient/labs"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{ background: '#F1F5F9' }}
              >
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                  <FlaskConical className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#0F172A' }}>Upload Labs</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Submit lab reports</p>
                </div>
              </Link>
              <Link
                href="/directory"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{ background: '#F1F5F9' }}
              >
                <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                  <UserSearch className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#0F172A' }}>Browse Directory</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Explore physicians</p>
                </div>
              </Link>
            </div>
          </div>

          {labResults.find((l) => l.aiInterpretation) && (
            <div className="rounded-lg shadow-sm p-6" style={{ background: 'rgba(219,234,254,0.3)', border: '1px solid #DBEAFE' }}>
              <h2 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#1E3A5F' }}>
                <span className="size-2 rounded-full" style={{ background: '#3B82F6' }} />
                AI Summary
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                {labResults.find((l) => l.aiInterpretation)?.aiInterpretation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
