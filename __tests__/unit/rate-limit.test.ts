import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({})),
}));

import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit (no Upstash configured)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('allows requests when no Redis is configured (dev fallback)', async () => {
    const result = await checkRateLimit('test-key-1', 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });

  it('uses default max requests when not specified', async () => {
    const result = await checkRateLimit('test-key-default');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('stays open when Redis credentials are missing at runtime', async () => {
    const previousUrl = process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;

    const result = await checkRateLimit('test-key-no-redis', 5, 60_000);
    expect(result.allowed).toBe(true);

    if (previousUrl !== undefined) process.env.UPSTASH_REDIS_REST_URL = previousUrl;
  });
});
