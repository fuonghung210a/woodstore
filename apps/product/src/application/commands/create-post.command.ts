export interface CreatePostCommandInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  relatedProductIds?: string[];
}

export class CreatePostCommand {
  constructor(readonly data: CreatePostCommandInput) {}
}
