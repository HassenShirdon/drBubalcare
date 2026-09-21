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
    doctor: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    appointment: {
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

import { GET as listDoctors } from '@/app/api/doctors/route';
import { GET as getDoctor } from '@/app/api/doctors/[id]/route';
import { GET as getDoctorPatients } from '@/app/api/doctor/patients/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { mockSession, idParamsRequest } from '../helpers';

describe('Doctors API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/doctors', () => {
    it('returns list of doctors with services and user info', async () => {
      const mockDoctors = [
        { id: 'doc-1', specialty: 'Cardiology', experience: 10, services: [{ id: 's-1', name: 'Consultation' }], user: { name: 'Dr. A', image: null } },
        { id: 'doc-2', specialty: 'Neurology', experience: 8, services: [], user: { name: 'Dr. B', image: 'img.jpg' } },
      ];
      vi.mocked(prisma.doctor.findMany).mockResolvedValue(mockDoctors as any);

      const res = await listDoctors();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockDoctors);
      expect(prisma.doctor.findMany).toHaveBeenCalledWith({
        include: { services: true, user: { select: { name: true, image: true } } },
      });
    });

    it('returns empty array when no doctors exist', async () => {
      vi.mocked(prisma.doctor.findMany).mockResolvedValue([]);

      const res = await listDoctors();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('GET /api/doctors/[id]', () => {
    it('returns doctor by id with includes', async () => {
      const mockDoctor = { id: 'doc-1', specialty: 'Cardiology', experience: 10, services: [{ id: 's-1', name: 'Consultation' }], user: { name: 'Dr. A', image: null } };
      vi.mocked(prisma.doctor.findUnique).mockResolvedValue(mockDoctor as any);

      const res = await getDoctor({} as Request, idParamsRequest('doc-1'));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockDoctor);
    });

    it('returns 404 when doctor not found', async () => {
      vi.mocked(prisma.doctor.findUnique).mockResolvedValue(null);

      const res = await getDoctor({} as Request, idParamsRequest('nonexistent'));
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Not found');
    });
  });

  describe('GET /api/doctor/patients', () => {
    it('returns 401 without auth', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const res = await getDoctorPatients();
      expect(res.status).toBe(401);
    });

    it('returns 403 for non-doctor role', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('PATIENT', 'patient-1'));

      const res = await getDoctorPatients();
      expect(res.status).toBe(403);
    });

    it('returns 404 when doctor profile not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-user-1'));
      vi.mocked(prisma.doctor.findUnique).mockResolvedValue(null);

      const res = await getDoctorPatients();
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Doctor profile not found');
    });

    it('returns list of patients sorted by last visit', async () => {
      vi.mocked(getServerSession).mockResolvedValue(mockSession('DOCTOR', 'doc-user-1'));
      vi.mocked(prisma.doctor.findUnique).mockResolvedValue({ id: 'doc-1', userId: 'doc-user-1' } as any);
      vi.mocked(prisma.appointment.groupBy).mockResolvedValue([
        { patientId: 'pat-1', _count: { patientId: 2 }, _max: { date: new Date('2024-07-01') } },
        { patientId: 'pat-2', _count: { patientId: 1 }, _max: { date: new Date('2024-05-01') } },
      ] as any);
      vi.mocked(prisma.user.findMany).mockResolvedValue([
        { id: 'pat-1', name: 'Alice', age: 32, gender: 'female' },
        { id: 'pat-2', name: 'Bob', age: 45, gender: 'male' },
      ] as any);

      const res = await getDoctorPatients();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].id).toBe('pat-1');
      expect(data[0].appointmentCount).toBe(2);
      expect(data[1].id).toBe('pat-2');
      expect(data[1].appointmentCount).toBe(1);
    });
  });
});
