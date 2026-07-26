import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development' && !process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  const { name, email, password, role, specialty, experience } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: 'email, password, and role are required' },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'User already exists', id: existing.id });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name: name || email, email, passwordHash, role },
  });

  if (role === 'DOCTOR' && specialty) {
    await prisma.doctor.create({
      data: {
        userId: user.id,
        specialty,
        experience: experience || null,
      },
    });
  }

  return NextResponse.json({ message: 'User created', id: user.id });
}
