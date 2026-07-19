import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { flagIncompleteUpload } from '@/lib/edge-cases/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { instructions } = await request.json();
  if (!instructions) {
    return NextResponse.json({ error: 'instructions are required' }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;
  await flagIncompleteUpload(id, userId, instructions);

  return NextResponse.json({ success: true });
}
