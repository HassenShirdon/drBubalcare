import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    appointment: {
      findMany: vi.fn(),
    },
  },
}));

import { GET as getAppointments } from '@/app/api/appointments/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { mockSession } from '../helpers';

describe('Appointments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/appointments', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getAppointments();
      expect(res.status).toBe(401);
    });

    it('returns upcoming appointments with doctor info', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      const mockAppointments = [
        {
          id: 'apt-1',
          patientId: 'patient-1',
          date: new Date('2099-01-15'),
          status: 'SCHEDULED',
          doctor: {
            id: 'doc-1',
            specialty: 'Cardiology',
            user: { name: 'Dr. A', image: null },
          },
        },
        {
          id: 'apt-2',
          patientId: 'patient-1',
          date: new Date('2099-02-20'),
          status: 'CONFIRMED',
          doctor: {
            id: 'doc-2',
            specialty: 'Neurology',
            user: { name: 'Dr. B', image: 'img.jpg' },
          },
        },
      ];
      vi.mocked(prisma.appointment.findMany).mockResolvedValue(mockAppointments as any);

      const res = await getAppointments();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].doctor.user.name).toBe('Dr. A');
      expect(data[1].doctor.user.name).toBe('Dr. B');
    });

    it('filters future appointments with SCHEDULED or CONFIRMED status', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const res = await getAppointments();
      await res.json();

      expect(prisma.appointment.findMany).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-1',
          date: { gte: expect.any(Date) },
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
        take: 5,
      });
    });

    it('returns empty array when no upcoming appointments', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));
      vi.mocked(prisma.appointment.findMany).mockResolvedValue([]);

      const res = await getAppointments();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });
  });
});
