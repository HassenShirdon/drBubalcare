import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readFile } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'private', 'uploads');

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ recordId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { recordId } = await params;
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const record = await prisma.caseRecord.findUnique({
    where: { id: recordId },
    include: { case: { select: { patientId: true, specialistId: true } } },
  });

  if (!record) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  }

  if (role === 'PATIENT' && record.case.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (role === 'DOCTOR' && record.case.specialistId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const filePath = path.join(UPLOAD_DIR, record.fileName);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': record.fileType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${record.fileName}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
  }
}
