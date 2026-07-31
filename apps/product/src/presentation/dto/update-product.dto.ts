import { z } from "zod";
import { WoodSpecies } from "../../domain/types/wood-species";

export const UpdateProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống").optional(),
  slug: z.string().min(1, "Slug không được để trống").optional(),
  price: z.number().positive("Giá phải lớn hơn 0").optional(),
  woodSpecies: z
    .enum(WoodSpecies, {
      message: "Loại gỗ không hợp lệ",
    })
    .optional(),

  // Optional fields
  categoryId: z.string().optional(),
  weightKg: z.number().positive().optional(),
  craftsmanship: z.string().optional(),
  artisan: z.string().optional(),
  finishType: z.string().optional(),
  sku: z.string().optional(),
  stockQuantity: z.number().int().min(0).default(0),
  isOneOfAKind: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
