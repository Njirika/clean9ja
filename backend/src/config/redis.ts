import Redis from 'ioredis';
import { env } from './env';

/**
 * Redis is optional.
 *
 * In a serverless deployment (Vercel) Redis must be an external, network-
 * reachable service such as Upstash (set REDIS_URL to its `rediss://` URL).
 * When REDIS_URL is not configured we export `null` and callers degrade
 * gracefully — caching is skipped and rate limiting falls back to an
 * in-memory store. The client is cached on `globalThis` and uses
 * `lazyConnect` so a connection is only opened on first use.
 */
const globalForRedis = globalThis as unknown as { redis?: Redis | null };

function createRedis(): Redis | null {
  if (!env.redisUrl) return null;

  const client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });

  client.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  return client;
}

export const redis: Redis | null =
  globalForRedis.redis !== undefined ? globalForRedis.redis : createRedis();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}
