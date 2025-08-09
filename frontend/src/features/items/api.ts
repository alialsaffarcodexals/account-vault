import { accountItemSchema } from '../../lib/schemas';
import { z } from 'zod';

export type Item = {
  id: number;
  category: string;
  displayName: string;
  url?: string;
  tags: string[];
  phoneBH?: string;
  createdAt: string;
  updatedAt: string;
  username?: string;
  password?: string;
  email?: string;
  notes?: string;
  custom: { key: string; value?: string }[];
};

async function csrf() {
  const r = await fetch('/api/me', { credentials: 'include' });
  const d = await r.json();
  return d.csrfToken as string;
}

export async function list(params: { q?: string; page?: number; pageSize?: number; category?: string }) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v != null && qs.set(k, String(v)));
  const res = await fetch(`/api/items?${qs.toString()}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load');
  return res.json() as Promise<{ items: Item[]; total: number }>;
}

export async function create(item: unknown) {
  const parsed = accountItemSchema.parse(item);
  const res = await fetch('/api/items', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'x-csrf-token': await csrf() },
    body: JSON.stringify(parsed)
  });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function patch(id: number, item: unknown) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'x-csrf-token': await csrf() },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function removeItem(id: number) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'x-csrf-token': await csrf() }
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}
