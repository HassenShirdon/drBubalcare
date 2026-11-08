import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { tasks } from '@trigger.dev/sdk';
import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'private', 'uploads');
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/dicom',
  'text/plain',
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  // Verify case exists and user has access
  const caseRecord = await prisma.case.findUnique({ where: { id } });
  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (role === 'PATIENT' && caseRecord.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Reject uploads on closed or disputed cases
  if (caseRecord.status === 'CLOSED' || caseRecord.status === 'DISPUTED') {
    return NextResponse.json({ error: 'Cannot upload files to a closed or disputed case' }, { status: 400 });
  }

  const formData = await request.formData();
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const uploadedRecords = [];
  const uploadDirReady = mkdir(UPLOAD_DIR, { recursive: true });

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File ${file.name} exceeds 50MB limit` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Collision-proof unique ID: used as both the record id and the on-disk
    // filename prefix, so concurrent uploads of the same original name never
    // overwrite each other (Date.now() collided within the same millisecond).
    const recordId = randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const diskFileName = `${recordId}_${safeName}`;
    const filePath = path.join(UPLOAD_DIR, diskFileName);

    // Ensure upload directory exists
    await uploadDirReady;

    // Write file to disk
    await writeFile(filePath, buffer);

    // Compute the file URL before the insert so the record is created in a
    // single write (no create-then-update round-trip).
    const fileUrl = `/api/records/${recordId}/file`;

    // Save to database — fileName stores the actual on-disk filename for retrieval
    const record = await prisma.caseRecord.create({
      data: {
        id: recordId,
        caseId: id,
        fileUrl,
        fileType: file.type,
        fileName: diskFileName,
      },
    });

    uploadedRecords.push(record);
  }

  // After successful file upload, trigger AI pre-screening (fire and forget)
  // Only trigger for opinion-style cases, not referrals
  if (caseRecord.serviceType !== 'EUROPEAN_REFERRAL') {
    const recordCount = await prisma.caseRecord.count({ where: { caseId: id } });
    if (recordCount === 1) {
      tasks
        .trigger('ai-prescreen', { caseId: id })
        .catch((err) => console.error('Pre-screening trigger failed:', err));
    }
  }

  return NextResponse.json(uploadedRecords, { status: 201 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  // Verify access
  const caseRecord = await prisma.case.findUnique({ where: { id } });
  if (!caseRecord) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  if (role === 'PATIENT' && caseRecord.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (role === 'DOCTOR' && caseRecord.specialistId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const records = await prisma.caseRecord.findMany({
    where: { caseId: id },
    orderBy: { uploadedAt: 'desc' },
  });

  return NextResponse.json(records);
}
