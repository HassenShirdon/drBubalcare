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

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const { encode } = await import('next-auth/jwt');
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'NEXTAUTH_SECRET not configured' }, { status: 500 });
  }

  const sessionToken = await encode({
    token: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    maxAge: 30 * 24 * 60 * 60,
  });

  const response = NextResponse.json({ ok: true, role: user.role });
  response.cookies.set('next-auth.session-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
