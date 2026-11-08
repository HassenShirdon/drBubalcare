import { headers } from 'next/headers';

export function getClientIp(headerStore: Headers): string {
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headerStore.get('x-real-ip') || 'unknown';
}

export async function getClientIpFromRequest(): Promise<string> {
  const headerStore = await headers();
  return getClientIp(headerStore);
}
