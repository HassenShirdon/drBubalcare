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

const statusColors: Record<string, { background: string; color: string }> = {
  SCHEDULED: { background: '#DBEAFE', color: '#1E40AF' },
  CONFIRMED: { background: '#DCFCE7', color: '#15803D' },
  IN_PROGRESS: { background: '#FEF3C7', color: '#B45309' },
  COMPLETED: { background: '#F1F5F9', color: '#64748B' },
  CANCELLED: { background: '#FEF2F2', color: '#B91C1C' },
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>Schedule</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
          {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-lg shadow-sm p-12 text-center" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <Calendar className="size-12 mx-auto mb-3" style={{ color: '#64748B' }} />
          <p className="text-base font-semibold" style={{ color: '#0F172A' }}>No appointments</p>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Your schedule will appear here once appointments are booked</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([dateKey, dayAppts]) => (
            <div key={dateKey}>
              <h2 className="font-semibold mb-3 text-sm pb-2" style={{ color: '#1E3A5F', borderBottom: '1px solid #E2E8F0' }}>
                {formatDate(new Date(dateKey + 'T00:00:00'))}
              </h2>
              <div className="space-y-2">
                {dayAppts.map((apt) => {
                  const colors = statusColors[apt.status] ?? { background: '#F1F5F9', color: '#64748B' };
                  return (
                    <div
                      key={apt.id}
                      className="rounded-lg shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                        {apt.patient.name?.charAt(0) ?? 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm" style={{ color: '#0F172A' }}>{apt.patient.name ?? 'Unknown Patient'}</p>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#64748B' }}>
                          <Clock className="size-3" />
                          {formatTime(apt.time)}
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                        style={{ background: colors.background, color: colors.color }}
                      >
                        {apt.status.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
