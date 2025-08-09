import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { hashPassword, verifyPassword } from '../crypto/argon';
import { createUserVault, decryptVK } from '../crypto/vkManager';
import { authLimiter } from '../security/rateLimit';
import { isLocked, recordLoginFailure, clearLoginFailures } from './lockout';

const r = Router();
const creds = z.object({ username: z.string().min(3), password: z.string().min(6) });

function setSessionVK(req: Request, vk: Buffer) { (req.session as any).vk = vk.toString('base64'); }
export function getSessionVK(req: Request): Buffer | null {
  const b64 = (req.session as any)?.vk;
  return b64 ? Buffer.from(b64, 'base64') : null;
}

r.post('/register', authLimiter, async (req: Request, res: Response) => {
  const parsed = creds.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const { username, password } = parsed.data;

  const exists = db.prepare('SELECT id FROM users WHERE username=?').get(username);
  if (exists) return res.status(409).json({ error: 'Username already exists' });

  const passwordHash = await hashPassword(password);
  const bootstrap = await createUserVault(password, passwordHash);
  const info = db.prepare('INSERT INTO users (username, password_hash, salt_kek_b64, vk_enc) VALUES (?, ?, ?, ?)')
    .run(username, bootstrap.passwordHash, bootstrap.salt_kek_b64, bootstrap.vk_enc);
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'Session error' });
    (req.session as any).userId = info.lastInsertRowid as number;
    setSessionVK(req, bootstrap.vk_plain_for_session);
    res.json({ ok: true });
  });
});

r.post('/login', authLimiter, async (req: Request, res: Response) => {
  const parsed = creds.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const { username, password } = parsed.data;

  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username) as any;
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (isLocked(user)) return res.status(423).json({ error: 'Account temporarily locked' });

  const ok = await verifyPassword(user.password_hash, password);
  if (!ok) { recordLoginFailure(db as any, username); return res.status(400).json({ error: 'Invalid credentials' }); }
  clearLoginFailures(db as any, user.id);

  const vk = await decryptVK(password, user.salt_kek_b64, user.vk_enc).catch(() => null);
  if (!vk) return res.status(400).json({ error: 'Invalid credentials' });

  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'Session error' });
    (req.session as any).userId = user.id;
    setSessionVK(req, vk as Buffer);
    res.json({ ok: true });
  });
});

r.post('/logout', (req: Request, res: Response) => { req.session.destroy(() => res.json({ ok: true })); });

export { r as authRoutes };
