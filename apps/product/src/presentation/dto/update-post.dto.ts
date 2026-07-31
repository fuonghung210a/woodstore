import { z } from 'zod';

export const UpdatePostSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').optional(),
  slug: z.string().min(1, 'Slug không được để trống').optional(),
  content: z.string().min(1, 'Nội dung không được để trống').optional(),
  excerpt: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  relatedProductIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
