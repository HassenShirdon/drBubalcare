import { NextResponse } from 'next/server';
import { checkUnmatchedCases } from '@/lib/edge-cases/service';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[Cron] CRON_SECRET is not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token || !timingSafeEqual(token, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await checkUnmatchedCases();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Cron] check-no-specialist failed:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
