import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
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

  const formData = await request.formData();
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const uploadedRecords = [];

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

    // Create unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Write file
    await writeFile(filePath, buffer);

    // Save to database
    const record = await prisma.caseRecord.create({
      data: {
        caseId: id,
        fileUrl: `/uploads/${fileName}`,
        fileType: file.type,
        fileName: file.name,
      },
    });

    uploadedRecords.push(record);
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
