// Client gọi API backend product service.
// Trong Next.js server components, gọi trực tiếp tới backend.
// Trong client components, gọi qua proxy /api (next.config rewrites).

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Price {
  amount: number;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: Price;
  woodSpecies: string;
  dimensions: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  } | null;
  weightKg: number | null;
  craftsmanship: string | null;
  artisan: string | null;
  finishType: string | null;
  sku: string | null;
  stockQuantity: number;
  isOneOfAKind: boolean;
  images: string[];
  tags: string[];
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  author: string | null;
  relatedProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HomepageData {
  categories: Category[];
  featuredProducts: Product[];
  newestProducts: Product[];
}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  woodSpecies?: string;
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // ===== Products =====
  listProducts(params: ListProductsParams = {}): Promise<PaginatedResult<Product>> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.woodSpecies) query.set('woodSpecies', params.woodSpecies);

    const qs = query.toString();
    return fetchJson(`/products${qs ? `?${qs}` : ''}`);
  },

  getProduct(id: string): Promise<Product> {
    return fetchJson(`/products/${id}`);
  },

  getProductBySlug(slug: string): Promise<Product> {
    return fetchJson(`/products/by-slug/${slug}`);
  },

  getFeatured(limit = 8): Promise<Product[]> {
    return fetchJson(`/products/featured?limit=${limit}`);
  },

  getHomepage(): Promise<HomepageData> {
    return fetchJson('/products/homepage');
  },

  // ===== Categories =====
  listCategories(onlyActive = true): Promise<Category[]> {
    return fetchJson(`/categories${onlyActive ? '?onlyActive=true' : ''}`);
  },

  getCategory(id: string): Promise<Category> {
    return fetchJson(`/categories/${id}`);
  },

  // ===== Posts =====
  listPublishedPosts(page = 1, limit = 10): Promise<PaginatedResult<Post>> {
    return fetchJson(`/posts/published?page=${page}&limit=${limit}`);
  },

  getPostBySlug(slug: string): Promise<Post> {
    return fetchJson(`/posts/slug/${slug}`);
  },
};
