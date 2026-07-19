import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fileDispute } from '@/lib/disputes/service';
import { fileDisputeSchema } from '@/lib/schemas/dispute.schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const parsed = fileDisputeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;

  const dispute = await fileDispute({
    caseId: id,
    patientId: userId,
    opinionId: parsed.data.opinionId,
    reason: parsed.data.reason,
  });

  return NextResponse.json(dispute, { status: 201 });
}
