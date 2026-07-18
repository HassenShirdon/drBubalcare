import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Users, Calendar, FlaskConical, Mail } from 'lucide-react';

async function getDoctor(userId: string) {
  return prisma.doctor.findUnique({
    where: { userId },
    include: {
      appointments: {
        include: {
          patient: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { date: 'desc' },
      },
    },
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;
  const doctor = await getDoctor(userId);
  if (!doctor) redirect('/auth/signin');

  const patientMap = new Map<string, { name: string | null; email: string; image: string | null; appointmentCount: number; lastVisit: Date | null }>();

  for (const apt of doctor.appointments) {
    const p = apt.patient;
    if (!patientMap.has(p.id)) {
      patientMap.set(p.id, { name: p.name, email: p.email, image: p.image, appointmentCount: 0, lastVisit: null });
    }
    const entry = patientMap.get(p.id)!;
    entry.appointmentCount++;
    if (!entry.lastVisit || apt.date > entry.lastVisit) {
      entry.lastVisit = apt.date;
    }
  }

  const patients = Array.from(patientMap.entries()).map(([id, data]) => ({ id, ...data }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-medical-black">Patients</h1>
        <p className="text-on-surface-variant mt-1 text-sm">{patients.length} total patient{patients.length !== 1 ? 's' : ''}</p>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-12 text-center">
          <Users className="size-12 text-on-surface-variant/30 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-text-medical-black mb-1">No patients yet</h2>
          <p className="text-on-surface-variant text-sm">Patients will appear once appointments are booked</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-gray">
                <th className="text-left font-semibold text-text-medical-black px-5 py-3">Patient</th>
                <th className="text-left font-semibold text-text-medical-black px-5 py-3 hidden sm:table-cell">Email</th>
                <th className="text-center font-semibold text-text-medical-black px-5 py-3">Appointments</th>
                <th className="text-right font-semibold text-text-medical-black px-5 py-3 hidden md:table-cell">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-bold text-xs shrink-0">
                        {patient.name?.charAt(0) ?? '?'}
                      </div>
                      <span className="font-medium text-text-medical-black">{patient.name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant hidden sm:table-cell">{patient.email}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-sm font-medium text-clinical-navy bg-clinical-navy/10 px-2.5 py-1 rounded-full">
                      {patient.appointmentCount}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-on-surface-variant hidden md:table-cell">
                    {patient.lastVisit ? formatDate(patient.lastVisit) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
