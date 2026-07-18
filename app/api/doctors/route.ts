import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: { services: true, user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(doctors, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
