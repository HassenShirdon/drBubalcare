import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    case: {
      findMany: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    specialistOpinion: {
      findUnique: vi.fn(),
    },
    doctor: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/notifications/service', () => ({
  notifyAdmin: vi.fn(),
  notifyPatient: vi.fn(),
  NOTIFICATION_TYPES: {
    NO_SPECIALIST_MATCHED: 'NO_SPECIALIST_MATCHED',
    URGENT_FINDING: 'URGENT_FINDING',
    INCOMPLETE_UPLOAD: 'INCOMPLETE_UPLOAD',
  },
}));

import { checkUnmatchedCases, findBackupSpecialist, flagIncompleteUpload } from '@/lib/edge-cases/service';
import { prisma } from '@/lib/db';
import { notifyAdmin, notifyPatient } from '@/lib/notifications/service';

describe('Edge Case Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checkUnmatchedCases alerts for cases open > 4 hours', async () => {
    vi.mocked(prisma.case.findMany).mockResolvedValue([
      { id: 'case-1', patientId: 'patient-1', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    ] as any);
    vi.mocked(notifyAdmin).mockResolvedValue();
    vi.mocked(notifyPatient).mockResolvedValue();

    await checkUnmatchedCases();

    expect(notifyAdmin).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'NO_SPECIALIST_MATCHED' })
    );
    expect(notifyPatient).toHaveBeenCalledWith(
      expect.objectContaining({ patientId: 'patient-1' })
    );
  });

  it('checkUnmatchedCases does not alert for recent cases', async () => {
    vi.mocked(prisma.case.findMany).mockResolvedValue([]);

    await checkUnmatchedCases();

    expect(notifyAdmin).not.toHaveBeenCalled();
  });

  it('findBackupSpecialist returns next available specialist', async () => {
    vi.mocked(prisma.doctor.findMany).mockResolvedValue([
      { userId: 'doc-2', specialty: 'Pathology', verified: true },
    ] as any);

    const result = await findBackupSpecialist('Pathology', 'doc-1');
    expect(result).toBe('doc-2');
  });

  it('findBackupSpecialist returns null when no backup available', async () => {
    vi.mocked(prisma.doctor.findMany).mockResolvedValue([]);

    const result = await findBackupSpecialist('Pathology', 'doc-1');
    expect(result).toBeNull();
  });

  it('flagIncompleteUpload notifies patient with instructions', async () => {
    vi.mocked(prisma.case.findUnique).mockResolvedValue({ patientId: 'patient-1' } as any);

    await flagIncompleteUpload('case-1', 'doc-1', 'Please upload pathology slides');

    expect(prisma.case.findUnique).toHaveBeenCalledWith({
      where: { id: 'case-1' },
      select: { patientId: true },
    });
    expect(notifyPatient).toHaveBeenCalledWith({
      patientId: 'patient-1',
      type: 'INCOMPLETE_UPLOAD',
      message: 'Please upload pathology slides',
      metadata: { caseId: 'case-1', flaggedBy: 'doc-1' },
    });
  });

  it('flagIncompleteUpload does nothing when case not found', async () => {
    vi.mocked(prisma.case.findUnique).mockResolvedValue(null);

    await flagIncompleteUpload('case-404', 'doc-1', 'Upload files');

    expect(notifyPatient).not.toHaveBeenCalled();
  });
});
