export interface PostEntityProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: Date | null;
  metaTitle: string | null;
  metaDescription: string | null;
  author: string | null;
  relatedProductIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PostEntity {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly content: string;
  readonly excerpt: string | null;
  readonly coverImage: string | null;
  readonly tags: string[];
  readonly status: 'DRAFT' | 'PUBLISHED';
  readonly publishedAt: Date | null;
  readonly metaTitle: string | null;
  readonly metaDescription: string | null;
  readonly author: string | null;
  readonly relatedProductIds: string[];
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: PostEntityProps) {
    this.id = props.id;
    this.title = props.title;
    this.slug = props.slug;
    this.content = props.content;
    this.excerpt = props.excerpt;
    this.coverImage = props.coverImage;
    this.tags = props.tags;
    this.status = props.status;
    this.publishedAt = props.publishedAt;
    this.metaTitle = props.metaTitle;
    this.metaDescription = props.metaDescription;
    this.author = props.author;
    this.relatedProductIds = props.relatedProductIds;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
