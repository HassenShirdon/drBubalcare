import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

function isAllowed(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') return false;
  const secret = request.headers.get('x-e2e-secret');
  if (process.env.E2E_SECRET && secret !== process.env.E2E_SECRET) return false;
  return true;
}

export async function POST(req: NextRequest) {
  if (!isAllowed(req)) {
    return NextResponse.json({ error: 'Not available outside E2E' }, { status: 403 });
  }

  const email = 'admin@drbubalcare.test';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'Admin already exists', id: existing.id });
  }

  const passwordHash = await bcrypt.hash('TestAdmin123!', 12);
  const user = await prisma.user.create({
    data: { name: 'Test Admin', email, passwordHash, role: 'ADMIN' },
  });

  return NextResponse.json({ message: 'Admin created', id: user.id });
}
