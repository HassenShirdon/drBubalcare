import { prisma } from '@/lib/db';
import { requireDoctor, serverError, ok } from '@/lib/api-helpers';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';

export async function GET() {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const cases = await prisma.case.findMany({
      where: { specialistId: auth.userId },
      include: {
        patient: { select: { name: true, age: true, gender: true } },
        opinions: {
          where: { specialistId: auth.userId },
          select: { id: true, status: true, signedAt: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (cases.length > 0) {
      await logAuditEvent({
        userId: auth.userId,
        action: AUDIT_ACTIONS.CASE_ASSIGN_SPECIALIST,
        resourceType: 'Case',
        resourceId: cases.map((c) => c.id).join(','),
        metadata: { action: 'list_assigned', count: cases.length },
      });
    }

    return ok(cases, 'private, no-store');
  } catch (error) {
    return serverError(error);
  }
}
