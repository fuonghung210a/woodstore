import { Injectable } from '@nestjs/common';
import { PrismaService } from '@woodshop/database';
import {
  IProductRepositoryType,
  IProductRepository,
} from '../../../domain/repositories/product-repository.interface';
import { ProductEntity, ProductEntityProps } from '../../../domain/entities/product.entity';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../../../domain/types';
import { WoodSpecies as PrismaWoodSpecies } from '@prisma/client';
import { WoodSpecies } from '../../../domain/types/wood-species';
import { Price } from '../../../domain/value-objects/price.vo';
import { Dimensions } from '../../../domain/value-objects/dimensions.vo';

@Injectable()
export class PrismaProductRepository implements IProductRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { slug, isActive: true, deletedAt: null },
      include: { category: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAll(
    filter: ProductFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductEntity>> {
    const where = this.buildWhere(filter);
    const skip = (pagination.page - 1) * pagination.limit;

    const [records, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: records.map((r) => this.toEntity(r)),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findFeatured(limit: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true, deletedAt: null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findNewest(limit: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { isActive: true, deletedAt: null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(data: CreateProductInput): Promise<ProductEntity> {
    const record = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price.amount,
        currency: data.price.currency,
        woodSpecies: data.woodSpecies,
        categoryId: data.categoryId,
        lengthCm: data.dimensions?.lengthCm ?? null,
        widthCm: data.dimensions?.widthCm ?? null,
        heightCm: data.dimensions?.heightCm ?? null,
        weightKg: data.weightKg,
        craftsmanship: data.craftsmanship,
        artisan: data.artisan,
        finishType: data.finishType,
        sku: data.sku,
        stockQuantity: data.stockQuantity ?? 0,
        isOneOfAKind: data.isOneOfAKind ?? false,
        images: data.images ?? [],
        tags: data.tags ?? [],
        isFeatured: data.isFeatured ?? false,
      },
      include: { category: true },
    });
    return this.toEntity(record);
  }

  async update(id: string, data: UpdateProductInput): Promise<ProductEntity> {
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.slug) updateData.slug = data.slug;
    if (data.price) {
      updateData.price = data.price.amount;
      updateData.currency = data.price.currency;
    }
    if (data.woodSpecies) updateData.woodSpecies = data.woodSpecies;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.dimensions !== undefined) {
      if (data.dimensions === null) {
        updateData.lengthCm = null;
        updateData.widthCm = null;
        updateData.heightCm = null;
      } else {
        updateData.lengthCm = data.dimensions.lengthCm;
        updateData.widthCm = data.dimensions.widthCm;
        updateData.heightCm = data.dimensions.heightCm;
      }
    }
    if (data.weightKg !== undefined) updateData.weightKg = data.weightKg;
    if (data.craftsmanship !== undefined) updateData.craftsmanship = data.craftsmanship;
    if (data.artisan !== undefined) updateData.artisan = data.artisan;
    if (data.finishType !== undefined) updateData.finishType = data.finishType;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;
    if (data.isOneOfAKind !== undefined) updateData.isOneOfAKind = data.isOneOfAKind;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const record = await this.prisma.product.update({
      where: { id, deletedAt: null },
      data: updateData,
      include: { category: true },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async findByCategory(
    categoryId: string,
    filter: ProductFilter,
  ): Promise<ProductEntity[]> {
    const where = this.buildWhere({ ...filter, categoryId });
    const records = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findByWoodSpecies(species: WoodSpecies): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { woodSpecies: species, isActive: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  private buildWhere(filter: ProductFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {
      isActive: filter.isActive ?? true,
      deletedAt: null,
    };
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { tags: { has: filter.search } },
      ];
    }
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.woodSpecies) where.woodSpecies = filter.woodSpecies;
    if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (filter.minPrice !== undefined) priceFilter.gte = filter.minPrice;
      if (filter.maxPrice !== undefined) priceFilter.lte = filter.maxPrice;
      where.price = priceFilter;
    }
    return where;
  }

  private toEntity(record: any): ProductEntity {
    const props: ProductEntityProps = {
      id: record.id,
      name: record.name,
      slug: record.slug,
      price: new Price(Number(record.price), record.currency),
      woodSpecies: record.woodSpecies as WoodSpecies,
      dimensions:
        record.lengthCm != null
          ? new Dimensions(
              Number(record.lengthCm),
              Number(record.widthCm),
              Number(record.heightCm),
            )
          : null,
      weightKg: record.weightKg != null ? Number(record.weightKg) : null,
      craftsmanship: record.craftsmanship,
      artisan: record.artisan,
      finishType: record.finishType,
      sku: record.sku,
      stockQuantity: record.stockQuantity,
      isOneOfAKind: record.isOneOfAKind,
      images: record.images as string[],
      tags: record.tags as string[],
      categoryId: record.categoryId,
      isActive: record.isActive,
      isFeatured: record.isFeatured,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    };
    return new ProductEntity(props);
  }
}
