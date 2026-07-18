import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Calendar, Clock, Users } from 'lucide-react';

async function getDoctor(userId: string) {
  return prisma.doctor.findUnique({ where: { userId } });
}

async function getAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where: { doctorId },
    include: {
      patient: { select: { name: true, email: true, image: true } },
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

const statusColors: Record<string, string> = {
  SCHEDULED: 'text-clinical-navy bg-clinical-navy/10',
  CONFIRMED: 'text-healing-teal bg-healing-teal/10',
  IN_PROGRESS: 'text-amber-600 bg-amber-50',
  COMPLETED: 'text-on-surface-variant bg-surface-gray/50',
  CANCELLED: 'text-red-500 bg-red-50',
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
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-medical-black">Schedule</h1>
        <p className="text-on-surface-variant mt-1 text-sm">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-12 text-center">
          <Calendar className="size-12 text-on-surface-variant/30 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-text-medical-black mb-1">No appointments</h2>
          <p className="text-on-surface-variant text-sm">Your schedule will appear here once appointments are booked</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([dateKey, dayAppts]) => (
            <div key={dateKey}>
              <h2 className="font-semibold text-text-medical-black mb-3 text-base">{formatDate(new Date(dateKey + 'T00:00:00'))}</h2>
              <div className="space-y-2">
                {dayAppts.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-4 flex items-center gap-4"
                  >
                    <div className="size-10 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-bold text-sm shrink-0">
                      {apt.patient.name?.charAt(0) ?? 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-medical-black text-sm">{apt.patient.name ?? 'Unknown Patient'}</p>
                      <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        {formatTime(apt.time)}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[apt.status] ?? 'text-on-surface-variant bg-surface-gray/50'}`}>
                      {apt.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
