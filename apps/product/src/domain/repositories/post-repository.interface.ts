import { PostEntity } from '../entities/post.entity';
import {
  CreatePostInput,
  UpdatePostInput,
  PostFilter,
  PaginationParams,
  PaginatedResult,
} from '../post-types';

export const IPostRepository = 'IPostRepository';

export interface IPostRepositoryType {
  findById(id: string): Promise<PostEntity | null>;
  findBySlug(slug: string): Promise<PostEntity | null>;
  findAll(
    filter: PostFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<PostEntity>>;
  findPublished(pagination: PaginationParams): Promise<PaginatedResult<PostEntity>>;
  findLatestPublished(limit: number): Promise<PostEntity[]>;
  create(data: CreatePostInput): Promise<PostEntity>;
  update(id: string, data: UpdatePostInput): Promise<PostEntity>;
  softDelete(id: string): Promise<void>;
}
