import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type AuthSuccess = { ok: true; userId: string };
type AuthFailure = { ok: false; response: NextResponse };
export type AuthResult = AuthSuccess | AuthFailure;

async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as { id: string }).id ?? null;
}

async function getSessionRole(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as { role: string }).role ?? null;
}

export async function requireAuth(): Promise<AuthResult> {
  const userId = await getSessionUserId();
  if (!userId) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  return { ok: true, userId };
}

export async function requireDoctor(): Promise<AuthResult> {
  const [userId, role] = await Promise.all([getSessionUserId(), getSessionRole()]);
  if (!userId) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (role !== 'DOCTOR') return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { ok: true, userId };
}

export function serverError(error: unknown): NextResponse {
  console.error('[API Error]', error);
  const message = error instanceof Error ? error.message : 'Internal server error';
  return NextResponse.json({ error: message }, { status: 500 });
}

export function badRequest(error: string): NextResponse {
  return NextResponse.json({ error }, { status: 400 });
}

export function notFound(resource: string): NextResponse {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function ok<T>(data: T, cache?: string): NextResponse {
  return NextResponse.json(data, cache ? { headers: { 'Cache-Control': cache } } : undefined);
}
