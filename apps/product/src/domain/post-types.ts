export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface PostFilter {
  search?: string;
  status?: PostStatus;
  tag?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status?: PostStatus;
  publishedAt?: Date | null;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  relatedProductIds?: string[];
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags?: string[];
  status?: PostStatus;
  publishedAt?: Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  author?: string | null;
  relatedProductIds?: string[];
  isActive?: boolean;
}
