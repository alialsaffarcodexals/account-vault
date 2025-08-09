import { Router, type Request, type Response } from 'express';
import { db } from '../db';
import { getSessionVK } from '../auth/routes';

const r = Router();
r.get('/export', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const vk = getSessionVK(req); if (!vk) return res.status(401).json({ error: 'Unauthorized' });
  const rows = db.prepare('SELECT * FROM items WHERE userId=?').all(uid);
  res.json({ version: 1, items: rows });
});
r.post('/import', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const vk = getSessionVK(req); if (!vk) return res.status(401).json({ error: 'Unauthorized' });
  const payload = req.body?.items; if (!Array.isArray(payload)) return res.status(400).json({ error: 'Invalid payload' });
  const insert = db.prepare(`INSERT INTO items (userId, category, displayName, username_enc, password_enc, email_enc, notes_enc, url, tags_json, phoneBH, custom_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const txn = db.transaction((items:any[]) => { for (const r of items) insert.run(uid, r.category, r.displayName, r.username_enc, r.password_enc, r.email_enc, r.notes_enc, r.url || null, r.tags_json || null, r.phoneBH || null, r.custom_json || null); });
  txn(payload);
  res.json({ ok: true, imported: payload.length });
});
export { r as exportRoutes };
