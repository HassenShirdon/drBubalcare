import { prisma } from '@/lib/db';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import type { ConsentStatus } from './types';

const GRACE_PERIOD_DAYS = 30;

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
