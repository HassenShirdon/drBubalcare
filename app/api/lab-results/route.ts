import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const labMetricSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
  unit: z.string().min(1),
  referenceRange: z.string().min(1),
  status: z.enum(['NORMAL', 'HIGH', 'LOW']).optional().default('NORMAL'),
});

const createLabResultSchema = z.object({
  name: z.string().min(1, 'name is required'),
  date: z.string().min(1, 'date is required'),
  doctor: z.string().min(1, 'doctor is required'),
  metrics: z.array(labMetricSchema).min(1, 'at least one metric is required'),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results = await prisma.labResult.findMany({
    where: { patientId: (session.user as { id: string }).id },
    include: { metrics: true },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'private, no-store',
    },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await request.json();
  const parsed = createLabResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, date, doctor, metrics } = parsed.data;

  const labResult = await prisma.labResult.create({
    data: {
      patientId: userId,
      name,
      date: new Date(date),
      doctor,
      icon: 'lab',
      metrics: {
        create: metrics.map((m) => ({
          name: m.name,
          value: m.value,
          unit: m.unit,
          referenceRange: m.referenceRange,
          status: m.status,
        })),
      },
    },
    include: { metrics: true },
  });

  fetch(`${process.env.NEXTAUTH_URL}/api/ai/trends/${userId}/analyze`, {
    method: 'POST',
    headers: {
      'x-internal-secret': process.env.INTERNAL_API_SECRET || '',
    },
  }).catch((err) => console.error('Trend analysis trigger failed:', err));

  return NextResponse.json(labResult, { status: 201 });
}
