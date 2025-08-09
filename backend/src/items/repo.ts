import { db } from '../db';
import { encryptAead, decryptAead } from '../crypto/aead';

export type ItemRow = {
  id: number; userId: number;
  category: string; displayName: string;
  username_enc: string | null; password_enc: string | null; email_enc: string | null; notes_enc: string | null;
  url: string | null; tags_json: string | null; phoneBH: string | null; custom_json: string | null;
  createdAt: string; updatedAt: string;
};

export function insertItem(userId: number, data: any, vk: Buffer) {
  const enc = (v?: string) => v ? encryptAead(Buffer.from(v), vk) : null;
  const info = db.prepare(`INSERT INTO items (userId, category, displayName, username_enc, password_enc, email_enc, notes_enc, url, tags_json, phoneBH, custom_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(userId, data.category, data.displayName, enc(data.username), enc(data.password), enc(data.email), enc(data.notes),
      data.url || null, JSON.stringify(data.tags || []), data.phoneBH || null,
      JSON.stringify((data.custom || []).map((c: any) => ({ key: c.key, valueEnc: enc(c.value) }))));
  return info.lastInsertRowid as number;
}

export function toItem(row: ItemRow, vk: Buffer) {
  const dec = (b?: string | null) => b ? decryptAead(b, vk).toString() : undefined;
  const custom = row.custom_json ? JSON.parse(row.custom_json).map((c:any)=> ({ key: c.key, value: dec(c.valueEnc) })) : [];
  return {
    id: row.id,
    category: row.category,
    displayName: row.displayName,
    username: dec(row.username_enc),
    password: dec(row.password_enc),
    email: dec(row.email_enc),
    notes: dec(row.notes_enc),
    url: row.url || undefined,
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    phoneBH: row.phoneBH || undefined,
    custom,
    createdAt: row.createdAt, updatedAt: row.updatedAt
  };
}

export function getItems(userId: number, params: { q?: string; page?: number; pageSize?: number }, vk: Buffer) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 50));
  const q = params.q?.trim();
  const where = ['userId = ?']; const args: any[] = [userId];
  if (q) { where.push('(displayName LIKE ? OR category LIKE ? OR tags_json LIKE ?)'); args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  const totalRow = db.prepare(`SELECT COUNT(*) as c FROM items WHERE ${where.join(' AND ')}`).get(...args) as { c: number };
  const rows = db.prepare(`SELECT * FROM items WHERE ${where.join(' AND ')} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`)
    .all(...args, pageSize, (page-1)*pageSize) as ItemRow[];
  return { items: rows.map(r => toItem(r, vk)), total: totalRow.c };
}
