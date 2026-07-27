import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpinionStatus } from '@/lib/generated/prisma/enums';
import { z } from 'zod';

const opinionSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  sign: z.boolean().optional().default(false),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const opinion = await prisma.specialistOpinion.findFirst({
    where: { caseId: id, specialistId: userId },
    include: { specialist: { select: { name: true } } },
  });

  return NextResponse.json(opinion || null);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = opinionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // Verify case is assigned to this doctor
  const caseRecord = await prisma.case.findFirst({
    where: { id, specialistId: userId },
  });
  if (!caseRecord) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  // Check if opinion already exists and is signed
  const existing = await prisma.specialistOpinion.findFirst({
    where: { caseId: id, specialistId: userId },
  });

  if (existing && existing.status === 'SIGNED') {
    return NextResponse.json({ error: 'Opinion already signed and cannot be edited' }, { status: 400 });
  }

  const opinionData = {
    content: parsed.data.content,
    status: (parsed.data.sign ? 'SIGNED' : 'DRAFT') as OpinionStatus,
    signedAt: parsed.data.sign ? new Date() : null,
  };

  let opinion;
  if (existing) {
    opinion = await prisma.specialistOpinion.update({
      where: { id: existing.id },
      data: opinionData,
    });
  } else {
    opinion = await prisma.specialistOpinion.create({
      data: {
        caseId: id,
        specialistId: userId,
        ...opinionData,
      },
    });
  }

  // If signed, transition case status to OPINION_READY
  if (parsed.data.sign) {
    await prisma.case.update({
      where: { id },
      data: { status: 'OPINION_READY' },
    });

    // Trigger plain-language summary generation after opinion signing (fire and forget)
    fetch(`${process.env.NEXTAUTH_URL}/api/ai/summary/${opinion.id}`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
      },
    }).catch((err) => console.error("Summary generation trigger failed:", err));

    // Check if case now has 2+ signed opinions — trigger synthesis (fire and forget)
    const signedOpinionCount = await prisma.specialistOpinion.count({
      where: { caseId: id, status: "SIGNED" },
    });

    if (signedOpinionCount >= 2) {
      // Check if synthesis already exists
      const existingSynthesis = await prisma.opinionSynthesis.findUnique({
        where: { caseId: id },
      });

      if (!existingSynthesis) {
        fetch(`${process.env.NEXTAUTH_URL}/api/ai/synthesis/${id}`, {
          method: "POST",
          headers: {
            "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
          },
        }).catch((err) => console.error("Synthesis trigger failed:", err));
      }
    }
  }

  return NextResponse.json(opinion);
}
