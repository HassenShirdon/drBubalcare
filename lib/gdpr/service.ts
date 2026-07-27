import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import type { ConsentStatus } from './types';

const GRACE_PERIOD_DAYS = 30;
const ANON_ID = '[DELETED]';

export async function getConsent(patientId: string): Promise<ConsentStatus[]> {
  return prisma.consentRecord.findMany({
    where: { patientId },
  }) as Promise<ConsentStatus[]>;
}

export async function updateConsent(
  patientId: string,
  consentType: string,
  granted: boolean
): Promise<void> {
  await prisma.consentRecord.upsert({
    where: { patientId_consentType: { patientId, consentType } },
    update: {
      granted,
      grantedAt: granted ? new Date() : null,
      revokedAt: granted ? null : new Date(),
    },
    create: {
      patientId,
      consentType,
      granted,
      grantedAt: granted ? new Date() : null,
      revokedAt: granted ? null : new Date(),
    },
  });

  await logAuditEvent({
    userId: patientId,
    action: granted ? AUDIT_ACTIONS.CONSENT_GIVEN : AUDIT_ACTIONS.CONSENT_REVOKED,
    resourceType: 'ConsentRecord',
    resourceId: `${patientId}-${consentType}`,
    metadata: { consentType, granted },
  });
}

export async function requestDeletion(patientId: string) {
  const existing = await prisma.dataDeletionRequest.findFirst({
    where: { patientId, status: 'PENDING' },
  });

  if (existing) {
    throw new Error('Deletion request already pending');
  }

  const now = new Date();
  const executeAt = new Date(now.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  const request = await prisma.dataDeletionRequest.create({
    data: {
      patientId,
      status: 'PENDING',
      requestedAt: now,
      executeAt,
    },
  });

  await logAuditEvent({
    userId: patientId,
    action: AUDIT_ACTIONS.DATA_DELETION_REQUESTED,
    resourceType: 'DataDeletionRequest',
    resourceId: request.id,
    metadata: { executeAt: executeAt.toISOString() },
  });

  return request;
}

export async function confirmDeletion(patientId: string) {
  const request = await prisma.dataDeletionRequest.findFirst({
    where: { patientId, status: 'PENDING' },
  });

  if (!request) throw new Error('No pending deletion request');

  return prisma.dataDeletionRequest.update({
    where: { id: request.id },
    data: { status: 'CONFIRMED' },
  });
}

export async function cancelDeletion(patientId: string) {
  const request = await prisma.dataDeletionRequest.findFirst({
    where: { patientId, status: 'PENDING' },
  });

  if (!request) throw new Error('No pending deletion request');

  return prisma.dataDeletionRequest.update({
    where: { id: request.id },
    data: { status: 'CANCELLED' },
  });
}

export async function executePendingDeletions(): Promise<number> {
  const now = new Date();

  const requests = await prisma.dataDeletionRequest.findMany({
    where: {
      status: 'CONFIRMED',
      executeAt: { lte: now },
      completedAt: null,
    },
  });

  for (const req of requests) {
    try {
      // Anonymize user PII — keep the record for FK integrity, erase all identifiers
      await prisma.user.update({
        where: { id: req.patientId },
        data: {
          name: ANON_ID,
          email: `deleted-${req.patientId}@anonymous`,
          emailVerified: null,
          image: null,
          passwordHash: null,
        },
      });

      // Delete PHI-only records
      await prisma.consentRecord.deleteMany({ where: { patientId: req.patientId } });
      await prisma.appointment.deleteMany({ where: { patientId: req.patientId } });
      await prisma.labResult.deleteMany({ where: { patientId: req.patientId } });
      await prisma.trendAnalysis.deleteMany({ where: { patientId: req.patientId } });
      await prisma.followUpQuestion.deleteMany({
        where: { opinion: { case: { patientId: req.patientId } } },
      });

      // Delete doctor profile if exists
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.patientId } });
      if (doctor) {
        await prisma.doctorService.deleteMany({ where: { doctorId: doctor.id } });
        await prisma.appointment.deleteMany({ where: { doctorId: doctor.id } });
        await prisma.doctor.delete({ where: { userId: req.patientId } });
      }

      // Mark deletion request as completed
      await prisma.dataDeletionRequest.update({
        where: { id: req.id },
        data: { status: 'COMPLETED', completedAt: now },
      });

      await logAuditEvent({
        userId: req.patientId,
        action: AUDIT_ACTIONS.DATA_DELETION_REQUESTED,
        resourceType: 'DataDeletionRequest',
        resourceId: req.id,
        metadata: { status: 'COMPLETED', executedAt: now.toISOString() },
      });
    } catch (error) {
      console.error(`[GDPR] Failed to execute deletion ${req.id}:`, error);
    }
  }

  return requests.length;
}
