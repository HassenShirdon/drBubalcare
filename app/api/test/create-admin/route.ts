import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST() {
  if (process.env.NODE_ENV !== 'development' && !process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
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
