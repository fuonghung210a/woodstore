import { Injectable } from '@nestjs/common';
import { PrismaService } from '@woodshop/database';
import { PostStatus as PrismaPostStatus } from '@prisma/client';
import {
  IPostRepositoryType,
  IPostRepository,
} from '../../../domain/repositories/post-repository.interface';
import { PostEntity, PostEntityProps } from '../../../domain/entities/post.entity';
import {
  CreatePostInput,
  UpdatePostInput,
  PostFilter,
  PaginationParams,
  PaginatedResult,
  PostStatus,
} from '../../../domain/post-types';

@Injectable()
export class PrismaPostRepository implements IPostRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PostEntity | null> {
    const record = await this.prisma.post.findUnique({
      where: { id, deletedAt: null },
    });
    return record ? this.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    const record = await this.prisma.post.findUnique({
      where: { slug, deletedAt: null },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAll(
    filter: PostFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PostEntity>> {
    const where = this.buildWhere(filter);
    const skip = (pagination.page - 1) * pagination.limit;

    const [records, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: records.map((r) => this.toEntity(r)),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findPublished(
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PostEntity>> {
    return this.findAll({ status: 'PUBLISHED' }, pagination);
  }

  async findLatestPublished(limit: number): Promise<PostEntity[]> {
    const records = await this.prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isActive: true,
        deletedAt: null,
        publishedAt: { not: null },
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(data: CreatePostInput): Promise<PostEntity> {
    const record = await this.prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt ?? null,
        coverImage: data.coverImage ?? null,
        tags: data.tags ?? [],
        status: (data.status ?? 'DRAFT') as PrismaPostStatus,
        publishedAt: data.publishedAt ?? (data.status === 'PUBLISHED' ? new Date() : null),
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        author: data.author ?? null,
        relatedProductIds: data.relatedProductIds ?? [],
      },
    });
    return this.toEntity(record);
  }

  async update(id: string, data: UpdatePostInput): Promise<PostEntity> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.status !== undefined) {
      updateData.status = data.status;
      // Tự set publishedAt khi chuyển sang PUBLISHED mà chưa có
      if (data.status === 'PUBLISHED' && data.publishedAt === undefined) {
        updateData.publishedAt = new Date();
      }
      if (data.status === 'DRAFT') {
        updateData.publishedAt = null;
      }
    }
    if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.relatedProductIds !== undefined) updateData.relatedProductIds = data.relatedProductIds;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const record = await this.prisma.post.update({
      where: { id, deletedAt: null },
      data: updateData,
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  private buildWhere(filter: PostFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {
      isActive: filter.status ? true : undefined,
      deletedAt: null,
    };
    if (where.isActive === undefined) delete where.isActive;

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter.status) where.status = filter.status;
    if (filter.tag) where.tags = { has: filter.tag };

    return where;
  }

  private toEntity(record: any): PostEntity {
    const props: PostEntityProps = {
      id: record.id,
      title: record.title,
      slug: record.slug,
      content: record.content,
      excerpt: record.excerpt,
      coverImage: record.coverImage,
      tags: record.tags as string[],
      status: record.status as PostStatus,
      publishedAt: record.publishedAt,
      metaTitle: record.metaTitle,
      metaDescription: record.metaDescription,
      author: record.author,
      relatedProductIds: record.relatedProductIds as string[],
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    };
    return new PostEntity(props);
  }
}
