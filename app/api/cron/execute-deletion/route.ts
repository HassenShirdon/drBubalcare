import { NextResponse } from 'next/server';
import { executePendingDeletions } from '@/lib/gdpr/service';

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
    const count = await executePendingDeletions();
    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error('[Cron] execute-deletion failed:', error);
    return NextResponse.json({ error: 'Deletion job failed' }, { status: 500 });
  }
}
