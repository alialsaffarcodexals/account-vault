import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { insertItem, getItems, toItem, type ItemRow } from './repo';
import { getSessionVK } from '../auth/routes';

const r = Router();
const schema = z.object({
  category: z.string().min(1),
  displayName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  phoneBH: z.string().optional(),
  notes: z.string().optional(),
  custom: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })).default([])
});

r.get('/', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const vk = getSessionVK(req);
  if (!vk) return res.status(401).json({ error: 'Unauthorized' });
  const page = parseInt((req.query.page as string) || '1', 10);
  const pageSize = parseInt((req.query.pageSize as string) || '50', 10);
  const q = (req.query.q as string) || undefined;
  const { items, total } = getItems(uid, { q, page, pageSize }, vk);
  res.json({ items, total });
});

r.post('/', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const vk = getSessionVK(req);
  if (!vk) return res.status(401).json({ error: 'Unauthorized' });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const id = insertItem(uid, parsed.data, vk);
  const row = db.prepare('SELECT * FROM items WHERE id=? AND userId=?').get(id, uid) as ItemRow;
  res.json(toItem(row, vk));
});

r.get('/:id', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const vk = getSessionVK(req);
  if (!vk) return res.status(401).json({ error: 'Unauthorized' });
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM items WHERE id=? AND userId=?').get(id, uid) as ItemRow | undefined;
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(toItem(row, vk));
});

r.patch('/:id', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const vk = getSessionVK(req);
  if (!vk) return res.status(401).json({ error: 'Unauthorized' });
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM items WHERE id=? AND userId=?').get(id, uid) as ItemRow | undefined;
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { category, displayName, url, tags, phoneBH } = req.body;
  db.prepare('UPDATE items SET category=?, displayName=?, url=?, tags_json=?, phoneBH=?, updatedAt=datetime("now") WHERE id=? AND userId=?')
    .run(category ?? row.category, displayName ?? row.displayName, url ?? row.url, JSON.stringify(tags ?? JSON.parse(row.tags_json || '[]')), phoneBH ?? row.phoneBH, id, uid);
  const updated = db.prepare('SELECT * FROM items WHERE id=? AND userId=?').get(id, uid) as ItemRow;
  res.json(toItem(updated, vk));
});

r.delete('/:id', (req: Request, res: Response) => {
  const uid = (req.session as any).userId as number;
  const id = parseInt(req.params.id, 10);
  const info = db.prepare('DELETE FROM items WHERE id=? AND userId=?').run(id, uid);
  if (!info.changes) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export { r as itemsRoutes };
