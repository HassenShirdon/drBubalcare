import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requestDeletion } from '@/lib/gdpr/service';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'PATIENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const userId = (session.user as { id: string }).id;

  try {
    const request = await requestDeletion(userId);
    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
