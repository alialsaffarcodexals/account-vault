import { randomUUID } from 'crypto';
import onFinished from 'on-finished';
import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const id = randomUUID();
  (req as any).rid = id;
  const start = Date.now();
  onFinished(res, () => {
    const ms = Date.now() - start;
    console.log(`[${id}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
