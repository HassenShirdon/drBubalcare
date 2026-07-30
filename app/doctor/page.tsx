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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>
          Welcome back, Dr. {doctor.user.name ?? 'Doctor'}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
          {doctor.specialty} &middot; {doctor.experience}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#0F172A' }}>{appointmentCount}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#DCFCE7', color: '#22C55E' }}>
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#0F172A' }}>{patientCount}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Total Patients</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
              <FlaskConical className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#0F172A' }}>{pendingReviewCount}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg shadow-sm p-5" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#1E3A5F' }}>
              <Calendar className="size-4" style={{ color: '#3B82F6' }} />
              Today&apos;s Schedule
            </h2>
            <span className="text-xs" style={{ color: '#64748B' }}>{formatDate(new Date())}</span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 mx-auto mb-3" style={{ color: '#94A3B8' }} />
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>No appointments today</p>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>Your schedule will appear here</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {appointments.map((apt) => (
                <li
                  key={apt.id}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                  style={{ background: '#F1F5F9' }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                    {apt.patient.name?.charAt(0) ?? 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: '#0F172A' }}>
                      {apt.patient.name ?? 'Unknown Patient'}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: '#64748B' }}>
                      <Clock className="size-3" />
                      {formatTime(apt.time)}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                    style={{
                      ...(apt.status === 'CONFIRMED'
                        ? { background: '#DCFCE7', color: '#15803D' }
                        : apt.status === 'SCHEDULED'
                          ? { background: '#DBEAFE', color: '#1E40AF' }
                          : { background: '#F1F5F9', color: '#64748B' }),
                    }}
                  >
                    {apt.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg shadow-sm p-5" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#1E3A5F' }}>
              <FlaskConical className="size-4" style={{ color: '#3B82F6' }} />
              Pending Lab Reviews
            </h2>
            <Link
              href="/doctor/labs/review"
              className="text-xs font-medium transition-colors"
              style={{ color: '#3B82F6' }}
            >
              View all
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="size-12 mx-auto mb-3" style={{ color: '#22C55E', opacity: 0.5 }} />
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>All labs reviewed</p>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>No pending reviews at this time</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {pendingReviews.map((lab) => (
                <li key={lab.id} className="flex items-center gap-3 p-3 rounded-lg transition-colors" style={{ background: '#F1F5F9' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                    <AlertCircle className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: '#0F172A' }}>{lab.name}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {lab.patient.name ?? 'Unknown'} &middot; {formatDate(lab.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#B45309' }}>
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
