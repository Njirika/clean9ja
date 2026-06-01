import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

/**
 * Build a Redis-backed store when Redis is available, otherwise return
 * `undefined` so express-rate-limit uses its built-in in-memory store.
 *
 * NOTE: the in-memory store is per-instance. On serverless platforms each
 * function instance counts requests independently, so for production-grade
 * rate limiting configure REDIS_URL (Upstash) to share counters globally.
 */
const makeStore = () =>
  redis
    ? new RedisStore({
        // @ts-ignore - ioredis call signature
        sendCommand: (...args: string[]) => redis.call(...args),
      })
    : undefined;

// General API rate limiter (100 req per 15 mins)
export const apiLimiter = rateLimit({
  store: makeStore(),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter auth rate limiter (10 req per hour)
export const authLimiter = rateLimit({
  store: makeStore(),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many authentication attempts, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});
