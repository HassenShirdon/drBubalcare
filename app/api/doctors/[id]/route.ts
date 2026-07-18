import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { services: true, user: { select: { name: true, image: true } } },
  });

  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(doctor);
}
