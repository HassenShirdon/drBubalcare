import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { notifyAdmin, notifyPatient, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import { prisma } from '@/lib/db';

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('notifyAdmin creates an audit log entry for admin alert', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await notifyAdmin({
      type: NOTIFICATION_TYPES.URGENT_FINDING,
      message: 'Critical finding in case case-1',
      metadata: { caseId: 'case-1' },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'ADMIN_ALERT',
        resourceType: 'Notification',
        resourceId: 'ADMIN_URGENT_FINDING',
        metadata: expect.objectContaining({
          type: 'URGENT_FINDING',
          message: 'Critical finding in case case-1',
          caseId: 'case-1',
        }),
      }),
    });
  });

  it('notifyPatient creates an audit log entry for patient notification', async () => {
    vi.mocked(prisma.auditLog.create).mockResolvedValue({} as any);

    await notifyPatient({
      patientId: 'patient-1',
      type: NOTIFICATION_TYPES.INCOMPLETE_UPLOAD,
      message: 'Please upload missing documents',
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'patient-1',
        action: 'PATIENT_NOTIFICATION',
        resourceType: 'Notification',
        resourceId: 'PATIENT_INCOMPLETE_UPLOAD',
        metadata: expect.objectContaining({
          type: 'INCOMPLETE_UPLOAD',
          message: 'Please upload missing documents',
        }),
      }),
    });
  });

  it('logs error but does not throw when prisma fails', async () => {
    vi.mocked(prisma.auditLog.create).mockRejectedValue(new Error('DB error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      notifyAdmin({
        type: NOTIFICATION_TYPES.URGENT_FINDING,
        message: 'Test',
      })
    ).resolves.not.toThrow();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
