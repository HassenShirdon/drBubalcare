import { describe, it, expect } from 'vitest';

// We need to test checkRateLimit in isolation by importing the function.
// Because the module has a side-effect setInterval that runs in Node, we
// isolate the pure logic via a dynamic import or by testing the module directly.
import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  it('allows the first request for a key', () => {
    const result = checkRateLimit('test-key-1', 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });

  it('allows requests up to the limit', () => {
    const key = `test-key-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(key, 5, 60_000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5 - i - 1);
    }
  });

  it('blocks requests that exceed the limit', () => {
    const key = `test-key-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60_000);
    }
    const result = checkRateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after the window expires', async () => {
    const key = `test-key-window-${Date.now()}`;
    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 100);
    }
    const blocked = checkRateLimit(key, 5, 100);
    expect(blocked.allowed).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    const result = checkRateLimit(key, 5, 100);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('uses default max requests when not specified', () => {
    const key = `test-key-default-${Date.now()}`;
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('tracks different keys independently', () => {
    const keyA = `test-key-a-${Date.now()}`;
    const keyB = `test-key-b-${Date.now()}`;

    // Exhaust key A
    for (let i = 0; i < 5; i++) {
      checkRateLimit(keyA, 5, 60_000);
    }
    expect(checkRateLimit(keyA, 5, 60_000).allowed).toBe(false);

    // Key B should still be allowed
    expect(checkRateLimit(keyB, 5, 60_000).allowed).toBe(true);
  });
});
