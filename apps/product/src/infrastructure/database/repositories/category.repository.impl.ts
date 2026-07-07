import { Injectable } from '@nestjs/common';
import { PrismaService } from '@woodshop/database';
import {
  ICategoryRepositoryType,
  ICategoryRepository,
} from '../../../domain/repositories/category-repository.interface';
import {
  CategoryEntity,
  CategoryEntityProps,
} from '../../../domain/entities/category.entity';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CategoryEntity | null> {
    const record = await this.prisma.category.findUnique({
      where: { id, isActive: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const record = await this.prisma.category.findUnique({
      where: { slug, isActive: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAll(): Promise<CategoryEntity[]> {
    const records = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toEntity(r));
  }

  async findActive(): Promise<CategoryEntity[]> {
    const records = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
  }): Promise<CategoryEntity> {
    const record = await this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
        sortOrder: data.sortOrder ?? 0,
      },
    });
    return this.toEntity(record);
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ): Promise<CategoryEntity> {
    const record = await this.prisma.category.update({
      where: { id },
      data,
    });
    return this.toEntity(record);
  }

  async findChildren(parentId: string): Promise<CategoryEntity[]> {
    const records = await this.prisma.category.findMany({
      where: { parentId, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toEntity(r));
  }

  private toEntity(record: any): CategoryEntity {
    const props: CategoryEntityProps = {
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      parentId: record.parentId,
      sortOrder: record.sortOrder,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    return new CategoryEntity(props);
  }
}
