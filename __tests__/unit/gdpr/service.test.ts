import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    consentRecord: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    dataDeletionRequest: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/audit/logger', () => ({
  logAuditEvent: vi.fn(),
  AUDIT_ACTIONS: {
    CONSENT_GIVEN: 'CONSENT_GIVEN',
    CONSENT_REVOKED: 'CONSENT_REVOKED',
    DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
    DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
    DATA_DELETION_EXECUTED: 'DATA_DELETION_EXECUTED',
  },
}));

import { getConsent, updateConsent, requestDeletion } from '@/lib/gdpr/service';
import { prisma } from '@/lib/db';
import { logAuditEvent } from '@/lib/audit/logger';

describe('GDPR Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getConsent returns consent records for patient', async () => {
    vi.mocked(prisma.consentRecord.findMany).mockResolvedValue([
      { consentType: 'AI_PROCESSING', granted: true },
    ] as any);

    const result = await getConsent('patient-1');
    expect(result).toHaveLength(1);
    expect(prisma.consentRecord.findMany).toHaveBeenCalledWith({
      where: { patientId: 'patient-1' },
    });
  });

  it('updateConsent creates or updates consent and logs audit', async () => {
    vi.mocked(prisma.consentRecord.upsert).mockResolvedValue({} as any);
    vi.mocked(logAuditEvent).mockResolvedValue();

    await updateConsent('patient-1', 'AI_PROCESSING', true);

    expect(prisma.consentRecord.upsert).toHaveBeenCalled();
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CONSENT_GIVEN' })
    );
  });

  it('requestDeletion creates deletion request with 30-day grace', async () => {
    vi.mocked(prisma.dataDeletionRequest.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.dataDeletionRequest.create).mockResolvedValue({} as any);
    vi.mocked(logAuditEvent).mockResolvedValue();

    await requestDeletion('patient-1');

    expect(prisma.dataDeletionRequest.create).toHaveBeenCalled();
    const call = vi.mocked(prisma.dataDeletionRequest.create).mock.calls[0][0];
    const executeAt = call.data.executeAt as Date;
    const diff = executeAt.getTime() - Date.now();
    expect(diff).toBeGreaterThan(29 * 24 * 60 * 60 * 1000);
    expect(diff).toBeLessThan(31 * 24 * 60 * 60 * 1000);
  });

  it('requestDeletion rejects if pending request exists', async () => {
    vi.mocked(prisma.dataDeletionRequest.findFirst).mockResolvedValue({ id: 'existing' } as any);

    await expect(requestDeletion('patient-1')).rejects.toThrow('Deletion request already pending');
  });
});
