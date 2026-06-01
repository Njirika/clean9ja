import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

export const cache = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // No Redis configured (e.g. serverless without Upstash) -> skip caching.
    if (!redis) {
      return next();
    }
    const client = redis; // capture non-null for use inside the closure below

    if (req.method !== 'GET') {
      return next();
    }

    // Admins might need fresh data, bypass cache for them if authenticated 
    // (This requires requireAuth to be run before, but often cache is on public routes)
    // To be safe, we just cache by URL. If there's an admin param, they can pass ?noCache=1
    if (req.query.noCache || req.query.includeInactive || req.query.includeUnpublished) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await client.get(key);

      if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
      } else {
        const originalJson = res.json;
        res.json = function (body) {
          // Check if response is successful
          if (res.statusCode >= 200 && res.statusCode < 300) {
            client.setex(key, durationInSeconds, JSON.stringify(body));
          }
          return originalJson.call(this, body);
        };
        next();
      }
    } catch (err) {
      next();
    }
  };
};
