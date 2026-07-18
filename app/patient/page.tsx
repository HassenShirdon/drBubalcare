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
        <h1 className="text-2xl md:text-3xl font-bold text-text-medical-black">
          Welcome back, {userName.split(' ')[0]}
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Here is your health overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text-medical-black flex items-center gap-2">
                <Calendar className="size-4 text-clinical-navy" />
                Upcoming Appointments
              </h2>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="size-10 text-on-surface-variant/30 mx-auto mb-2" />
                <p className="text-on-surface-variant text-sm">No upcoming appointments</p>
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-1 mt-3 text-clinical-navy font-medium text-sm hover:text-healing-teal transition-colors"
                >
                  Book an appointment <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {appointments.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
                  >
                    <div className="size-10 rounded-full bg-evidence-blue-light/50 flex items-center justify-center text-clinical-navy font-bold text-sm shrink-0">
                      {apt.doctor.user.name?.charAt(0) ?? 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-medical-black text-sm truncate">
                        {apt.doctor.user.name}
                      </p>
                      <p className="text-on-surface-variant text-xs">
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-clinical-navy bg-clinical-navy/10 px-2.5 py-1 rounded-full capitalize">
                      {apt.status.toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text-medical-black flex items-center gap-2">
                <FlaskConical className="size-4 text-clinical-navy" />
                Recent Lab Results
              </h2>
              <Link
                href="/patient/labs"
                className="text-clinical-navy text-sm font-medium hover:text-healing-teal transition-colors"
              >
                View all
              </Link>
            </div>

            {labResults.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="size-10 text-on-surface-variant/30 mx-auto mb-2" />
                <p className="text-on-surface-variant text-sm">No lab results yet</p>
                <Link
                  href="/patient/labs"
                  className="inline-flex items-center gap-1 mt-3 text-clinical-navy font-medium text-sm hover:text-healing-teal transition-colors"
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
                      className="flex items-center gap-4 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
                    >
                      <div className="size-10 rounded-full bg-evidence-blue-light/50 flex items-center justify-center shrink-0">
                        {lab.status === 'NORMAL' ? (
                          <CheckCircle2 className="size-5 text-healing-teal" />
                        ) : (
                          <AlertCircle className="size-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-medical-black text-sm truncate">{lab.name}</p>
                        <p className="text-on-surface-variant text-xs">{formatDate(lab.date)}</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          lab.status === 'NORMAL'
                            ? 'text-healing-teal bg-healing-teal/10'
                            : 'text-amber-600 bg-amber-50'
                        }`}
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
          <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6">
            <h2 className="font-semibold text-text-medical-black mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/patient/cases/new"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
              >
                <div className="size-9 rounded-lg bg-clinical-navy/10 flex items-center justify-center text-clinical-navy">
                  <FileText className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-text-medical-black text-sm">Start a Case</p>
                  <p className="text-on-surface-variant text-xs">Get a specialist opinion</p>
                </div>
              </Link>
              <Link
                href="/directory"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
              >
                <div className="size-9 rounded-lg bg-clinical-navy/10 flex items-center justify-center text-clinical-navy">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-text-medical-black text-sm">Book Appointment</p>
                  <p className="text-on-surface-variant text-xs">Find a specialist</p>
                </div>
              </Link>
              <Link
                href="/patient/labs"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
              >
                <div className="size-9 rounded-lg bg-clinical-navy/10 flex items-center justify-center text-clinical-navy">
                  <FlaskConical className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-text-medical-black text-sm">Upload Labs</p>
                  <p className="text-on-surface-variant text-xs">Submit lab reports</p>
                </div>
              </Link>
              <Link
                href="/directory"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
              >
                <div className="size-9 rounded-lg bg-clinical-navy/10 flex items-center justify-center text-clinical-navy">
                  <UserSearch className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-text-medical-black text-sm">Browse Directory</p>
                  <p className="text-on-surface-variant text-xs">Explore physicians</p>
                </div>
              </Link>
            </div>
          </div>

          {labResults.find((l) => l.aiInterpretation) && (
            <div className="bg-gradient-to-br from-evidence-blue-light/30 to-surface border border-evidence-blue-light/60 rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-text-medical-black mb-2 flex items-center gap-2">
                <span className="size-2 bg-clinical-navy rounded-full" />
                AI Summary
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {labResults.find((l) => l.aiInterpretation)?.aiInterpretation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
