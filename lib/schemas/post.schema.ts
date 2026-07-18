import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title required'),
  slug: z.string().min(1, 'Slug required').regex(/^[a-z0-9-]+$/, 'Invalid slug format (lowercase, hyphens only)'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content required'),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;
