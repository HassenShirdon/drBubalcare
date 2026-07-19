import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await request.json();

  const { name, date, doctor, metrics } = body;

  if (!name || !date || !doctor || !metrics || !Array.isArray(metrics)) {
    return NextResponse.json(
      { error: "name, date, doctor, and metrics array are required" },
      { status: 400 }
    );
  }

  const labResult = await prisma.labResult.create({
    data: {
      patientId: userId,
      name,
      date: new Date(date),
      doctor,
      icon: "lab",
      metrics: {
        create: metrics.map((m: { name: string; value: number; unit: string; referenceRange: string; status?: string }) => ({
          name: m.name,
          value: m.value,
          unit: m.unit,
          referenceRange: m.referenceRange,
          status: (m.status || "NORMAL") as "NORMAL" | "HIGH" | "LOW",
        })),
      },
    },
    include: { metrics: true },
  });

  fetch(`${process.env.NEXTAUTH_URL}/api/ai/trends/${userId}/analyze`, {
    method: "POST",
    headers: {
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
    },
  }).catch((err) => console.error("Trend analysis trigger failed:", err));

  return NextResponse.json(labResult, { status: 201 });
}
