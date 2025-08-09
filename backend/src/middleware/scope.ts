import type { Request, Response, NextFunction } from 'express';
export function userId(req: Request): number {
  return (req.session as any).userId as number;
}
export function withUserScope(req: Request, res: Response, next: NextFunction) {
  if (!userId(req)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
