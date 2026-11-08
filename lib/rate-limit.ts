import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiters = new Map<string, Ratelimit>();

function getLimiter(client: Redis, keyPrefix: string, maxRequests: number, windowMs: number): Ratelimit {
  const cacheKey = `${keyPrefix}:${maxRequests}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.fixedWindow(maxRequests, `${windowMs} ms`),
      prefix: `dbc:${keyPrefix}`,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export async function checkRateLimit(
  key: string,
  maxRequests = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): Promise<RateLimitResult> {
  if (!redis) {
    return { allowed: true, remaining: maxRequests, resetAt: Date.now() + windowMs };
  }
  const [prefix, ...rest] = key.split(':');
  const identifier = rest.join(':');
  const limiter = getLimiter(redis, prefix, maxRequests, windowMs);
  const { success, remaining, reset } = await limiter.limit(identifier);
  return { allowed: success, remaining, resetAt: reset };
}
