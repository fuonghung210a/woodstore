import { z } from 'zod';

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').optional(),
  slug: z.string().min(1, 'Slug không được để trống').optional(),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
