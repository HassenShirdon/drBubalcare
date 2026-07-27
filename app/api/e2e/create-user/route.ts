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
