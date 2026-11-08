import { prisma } from '@/lib/db';
import { requireDoctor, serverError, notFound, badRequest, ok } from '@/lib/api-helpers';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { OpinionStatus } from '@/lib/generated/prisma/enums';
import { tasks } from '@trigger.dev/sdk';
import { z } from 'zod';

const CONTENT_MAX_LENGTH = 100_000;

const opinionSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(CONTENT_MAX_LENGTH, `Content must be under ${CONTENT_MAX_LENGTH.toLocaleString()} characters`),
  sign: z.boolean().optional().default(false),
});

const SECTIONS = ['Clinical Findings', 'Impression', 'Recommended Next Steps'];

function validateSignedContent(content: string): string | null {
  for (const section of SECTIONS) {
    const regex = new RegExp(`##\\s*${section}[\\s\\S]*?(?=\\n##|$)`);
    const match = content.match(regex);
    if (!match) return `Missing section: "${section}"`;
    const body = match[0].replace(new RegExp(`##\\s*${section}\\s*\\n?`), '').trim();
    if (!body) return `Section "${section}" must have content when signing`;
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    const opinion = await prisma.specialistOpinion.findFirst({
      where: { caseId: id, specialistId: auth.userId },
      include: { specialist: { select: { name: true } } },
    });

    return ok(opinion || null);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireDoctor();
    if (!auth.ok) return auth.response;

    const rateCheck = await checkRateLimit(`opinion:${auth.userId}`, 20, 60_000);
    if (!rateCheck.allowed) {
      return badRequest('Too many requests. Please slow down.');
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = opinionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(Object.values(parsed.error.flatten().fieldErrors).flat().join(', '));
    }

    // Validate all 3 sections have content when signing
    if (parsed.data.sign) {
      const sectionError = validateSignedContent(parsed.data.content);
      if (sectionError) return badRequest(sectionError);
    }

    const [opinion] = await prisma.$transaction(async (tx) => {
      // Verify case is assigned to this doctor
      const caseRecord = await tx.case.findFirst({
        where: { id, specialistId: auth.userId },
      });
      if (!caseRecord) throw new Error('NOT_FOUND');

      // Check if opinion already exists and is signed
      const existing = await tx.specialistOpinion.findFirst({
        where: { caseId: id, specialistId: auth.userId },
      });

      if (existing && existing.status === 'SIGNED') {
        throw new Error('ALREADY_SIGNED');
      }

      const opinionData = {
        content: parsed.data.content,
        status: (parsed.data.sign ? 'SIGNED' : 'DRAFT') as OpinionStatus,
        signedAt: parsed.data.sign ? new Date() : null,
      };

      let saved;
      if (existing) {
        saved = await tx.specialistOpinion.update({
          where: { id: existing.id },
          data: opinionData,
        });
      } else {
        saved = await tx.specialistOpinion.create({
          data: { caseId: id, specialistId: auth.userId, ...opinionData },
        });
      }

      // If signed, transition case status
      if (parsed.data.sign) {
        await tx.case.update({
          where: { id },
          data: { status: 'OPINION_READY' },
        });

        await logAuditEvent({
          userId: auth.userId,
          action: AUDIT_ACTIONS.OPINION_SIGNED,
          resourceType: 'SpecialistOpinion',
          resourceId: saved.id,
          after: { caseId: id, status: 'SIGNED' },
        });
      } else {
        await logAuditEvent({
          userId: auth.userId,
          action: AUDIT_ACTIONS.OPINION_DRAFT_CREATED,
          resourceType: 'SpecialistOpinion',
          resourceId: saved.id,
          after: { caseId: id, status: 'DRAFT' },
        });
      }

      return [saved];
    });

    // Fire-and-forget AI triggers (after transaction commits)
    if (parsed.data.sign) {
      tasks
        .trigger('ai-summary', { opinionId: opinion.id })
        .catch((err) => console.error('Summary trigger failed:', err));

      const signedCount = await prisma.specialistOpinion.count({
        where: { caseId: id, status: 'SIGNED' },
      });

      if (signedCount >= 2) {
        const existingSynth = await prisma.opinionSynthesis.findUnique({
          where: { caseId: id },
        });
        if (!existingSynth) {
          tasks
            .trigger('ai-synthesis', { caseId: id })
            .catch((err) => console.error('Synthesis trigger failed:', err));
        }
      }
    }

    return ok(opinion);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'NOT_FOUND') return notFound('Case');
      if (error.message === 'ALREADY_SIGNED') return badRequest('Opinion already signed and cannot be edited');
      if (error instanceof z.ZodError) return badRequest(error.message);
    }
    return serverError(error);
  }
}
