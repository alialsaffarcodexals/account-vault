import { z } from 'zod';

export const urlSchema = z.string().url().optional().or(z.literal(''));
export const phoneBHScheme = z.string().optional(); // parsed/validated in component

export const accountItemSchema = z.object({
  id: z.number().optional(),
  category: z.string().min(1),
  displayName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  url: urlSchema,
  tags: z.array(z.string()).default([]),
  phoneBH: z.string().optional(),
  notes: z.string().optional(),
  custom: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })).default([])
});

export type AccountItemForm = z.infer<typeof accountItemSchema>;
