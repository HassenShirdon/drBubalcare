import { prisma } from '@/lib/db';
import { requireDoctor, serverError, notFound, ok } from '@/lib/api-helpers';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    const caseRecord = await prisma.case.findFirst({
      where: { id, specialistId: auth.userId },
      include: {
        patient: { select: { name: true, age: true, gender: true } },
        records: true,
        aiPrescreens: { take: 1 },
        opinions: {
          where: { specialistId: auth.userId },
          include: { specialist: { select: { name: true } } },
          take: 1,
        },
      },
    });

    if (!caseRecord) return notFound('Case');

    await logAuditEvent({
      userId: auth.userId,
      action: AUDIT_ACTIONS.CASE_ASSIGN_SPECIALIST,
      resourceType: 'Case',
      resourceId: id,
      metadata: { action: 'read_detail' },
    });

    return ok(caseRecord, 'private, no-store');
  } catch (error) {
    return serverError(error);
  }
}
