import { prisma } from '@/lib/db';
import type { NotifyAdminParams, NotifyPatientParams } from './types';

export const NOTIFICATION_TYPES = {
  URGENT_FINDING: 'URGENT_FINDING',
  DISPUTE_FILED: 'DISPUTE_FILED',
  DATA_EXPORT_REQUESTED: 'DATA_EXPORT_REQUESTED',
  DATA_DELETION_REQUESTED: 'DATA_DELETION_REQUESTED',
  NO_SPECIALIST_MATCHED: 'NO_SPECIALIST_MATCHED',
  INCOMPLETE_UPLOAD: 'INCOMPLETE_UPLOAD',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

const ADMIN_USER_ID = 'system-admin';

export async function notifyAdmin(params: NotifyAdminParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: ADMIN_USER_ID,
        action: 'ADMIN_ALERT',
        resourceType: 'Notification',
        resourceId: `ADMIN_${params.type}`,
        metadata: {
          type: params.type,
          message: params.message,
          ...params.metadata,
        },
      },
    });
  } catch (error) {
    console.error('[NotificationService] Failed to create admin alert:', error);
  }
}

export async function notifyPatient(params: NotifyPatientParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.patientId,
        action: 'PATIENT_NOTIFICATION',
        resourceType: 'Notification',
        resourceId: `PATIENT_${params.type}`,
        metadata: {
          type: params.type,
          message: params.message,
          ...params.metadata,
        },
      },
    });
  } catch (error) {
    console.error('[NotificationService] Failed to create patient notification:', error);
  }
}
