import { NextResponse } from 'next/server';
import { checkUnmatchedCases } from '@/lib/edge-cases/service';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
