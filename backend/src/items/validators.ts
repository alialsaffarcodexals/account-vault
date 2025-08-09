import { z } from 'zod';
export const itemSchema = z.object({
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
