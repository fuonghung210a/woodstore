import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  content: z.string().min(1, 'Nội dung không được để trống'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  author: z.string().optional(),
  relatedProductIds: z.array(z.string()).default([]),
});

export type CreatePostDto = z.infer<typeof CreatePostSchema>;
