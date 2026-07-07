import { CategoryEntity } from '../entities/category.entity';

export const ICategoryRepository = 'ICategoryRepository';

export interface ICategoryRepositoryType {
  findById(id: string): Promise<CategoryEntity | null>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  findAll(): Promise<CategoryEntity[]>;
  findActive(): Promise<CategoryEntity[]>;
  create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
  }): Promise<CategoryEntity>;
  update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ): Promise<CategoryEntity>;
  findChildren(parentId: string): Promise<CategoryEntity[]>;
}
