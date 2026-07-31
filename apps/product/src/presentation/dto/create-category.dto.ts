import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z.string().min(1, 'Slug không được để trống'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
