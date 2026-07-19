import { prisma } from '@/lib/db';
import { notifyAdmin, notifyPatient, NOTIFICATION_TYPES } from '@/lib/notifications/service';
import { EdgeCaseType } from './types';

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export async function checkUnmatchedCases(): Promise<void> {
  const cutoff = new Date(Date.now() - FOUR_HOURS_MS);

  const unmatchedCases = await prisma.case.findMany({
    where: {
      status: 'OPEN',
      specialistId: null,
      createdAt: { lt: cutoff },
    },
    select: { id: true, patientId: true, createdAt: true },
  });

  for (const c of unmatchedCases) {
    await notifyAdmin({
      type: NOTIFICATION_TYPES.NO_SPECIALIST_MATCHED,
      message: `Case ${c.id} has been open for over 4 hours without a specialist`,
      metadata: { caseId: c.id, patientId: c.patientId },
    });

    await notifyPatient({
      patientId: c.patientId,
      type: NOTIFICATION_TYPES.NO_SPECIALIST_MATCHED,
      message: 'We are working to assign a specialist to your case. You will be notified once assigned.',
      metadata: { caseId: c.id },
    });
  }
}

export async function findBackupSpecialist(
  specialty: string,
  excludeSpecialistId: string
): Promise<string | null> {
  const available = await prisma.doctor.findMany({
    where: {
      specialty,
      verified: true,
      userId: { not: excludeSpecialistId },
    },
    select: { userId: true },
    take: 1,
  });

  return available[0]?.userId ?? null;
}

export async function flagIncompleteUpload(
  caseId: string,
  specialistId: string,
  instructions: string
): Promise<void> {
  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
    select: { patientId: true },
  });

  if (!caseRecord) return;

  await notifyPatient({
    patientId: caseRecord.patientId,
    type: NOTIFICATION_TYPES.INCOMPLETE_UPLOAD,
    message: instructions,
    metadata: { caseId, flaggedBy: specialistId },
  });
}
