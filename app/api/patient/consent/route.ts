import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getConsent, updateConsent } from '@/lib/gdpr/service';
import { consentSchema } from '@/lib/schemas/gdpr.schema';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const userId = (session.user as { id: string }).id;
  const consent = await getConsent(userId);
  return NextResponse.json(consent);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const userId = (session.user as { id: string }).id;
  const body = await request.json();
  const parsed = consentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await updateConsent(userId, parsed.data.consentType, parsed.data.granted);
  return NextResponse.json({ success: true });
}
