import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../env';

export function ensureCsrf(req: Request, res: Response, next: NextFunction) {
  const name = env.CSRF_COOKIE_NAME;
  let token = req.cookies?.[name];
  if (!token) {
    token = crypto.randomBytes(16).toString('hex');
    res.cookie(name, token, { httpOnly: false, sameSite: 'lax' });
  }
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const header = req.get('x-csrf-token');
  if (!header || header !== token) return res.status(403).json({ error: 'CSRF token invalid' });
  next();
}
