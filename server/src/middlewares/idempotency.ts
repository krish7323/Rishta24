import { Request, Response, NextFunction } from 'express';

interface CachedResponse {
  statusCode: number;
  body: any;
  timestamp: number;
}

const idempotencyCache = new Map<string, CachedResponse>();

// Clean up stale idempotency keys every hour (24-hour TTL)
setInterval(() => {
  const now = Date.now();
  const TTL = 24 * 60 * 60 * 1000;
  for (const [key, val] of idempotencyCache.entries()) {
    if (now - val.timestamp > TTL) {
      idempotencyCache.delete(key);
    }
  }
}, 60 * 60 * 1000);

export const idempotencyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Only apply idempotency to state-changing methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  const idempotencyKey =
    (req.headers['idempotency-key'] as string) ||
    (req.headers['x-request-id'] as string);

  if (!idempotencyKey) {
    next();
    return;
  }

  // Check if request with key was already processed
  const cached = idempotencyCache.get(idempotencyKey);
  if (cached) {
    res.setHeader('X-Cache-Lookup', 'IDEMPOTENCY_HIT');
    res.status(cached.statusCode).json(cached.body);
    return;
  }

  // Intercept json/send response to store in cache
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    // Only cache successful or client validation responses (not 5xx server errors)
    if (res.statusCode < 500) {
      idempotencyCache.set(idempotencyKey, {
        statusCode: res.statusCode,
        body,
        timestamp: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
};
