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
      patient: { select: { name: true, email: true, image: true } },
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

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="font-headline-md text-xl md:text-2xl font-semibold text-text-medical-black">
          Welcome, {doctor.user.name ?? 'Doctor'}
        </h1>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          {doctor.specialty} &middot; {doctor.experience}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy">
              <Calendar className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{appointmentCount}</p>
              <p className="text-[11px] text-on-surface-variant">Total Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{patientCount}</p>
              <p className="text-[11px] text-on-surface-variant">Total Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <FlaskConical className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{pendingReviewCount}</p>
              <p className="text-[11px] text-on-surface-variant">Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md font-semibold text-sm text-text-medical-black flex items-center gap-2">
              <Calendar className="size-3.5 text-clinical-navy" />
              Today&apos;s Schedule
            </h2>
            <span className="text-[11px] text-on-surface-variant">{formatDate(new Date())}</span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="size-8 text-on-surface-variant/30 mx-auto mb-2" />
              <p className="text-on-surface-variant text-xs">No appointments scheduled today</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {appointments.map((apt) => (
                <li
                  key={apt.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-surface hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-semibold text-xs shrink-0">
                    {apt.patient.name?.charAt(0) ?? 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-medical-black text-xs truncate">
                      {apt.patient.name ?? 'Unknown Patient'}
                    </p>
                    <p className="text-on-surface-variant text-[11px] flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatTime(apt.time)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                      apt.status === 'CONFIRMED'
                        ? 'text-healing-teal bg-healing-teal/10'
                        : apt.status === 'SCHEDULED'
                          ? 'text-clinical-navy bg-clinical-navy/10'
                          : 'text-on-surface-variant bg-surface-gray/50'
                    }`}
                  >
                    {apt.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md font-semibold text-sm text-text-medical-black flex items-center gap-2">
              <FlaskConical className="size-3.5 text-clinical-navy" />
              Pending Lab Reviews
            </h2>
            <Link
              href="/doctor/labs/review"
              className="text-clinical-navy text-xs font-medium hover:text-healing-teal transition-colors"
            >
              View all
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="size-8 text-healing-teal/50 mx-auto mb-2" />
              <p className="text-on-surface-variant text-xs">All labs reviewed</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {pendingReviews.map((lab) => (
                <li key={lab.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertCircle className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-medical-black text-xs truncate">{lab.name}</p>
                    <p className="text-on-surface-variant text-[11px]">
                      {lab.patient.name ?? 'Unknown'} &middot; {formatDate(lab.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {lab.metrics.filter((m) => m.status !== 'NORMAL').length} flag
                      {lab.metrics.filter((m) => m.status !== 'NORMAL').length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
