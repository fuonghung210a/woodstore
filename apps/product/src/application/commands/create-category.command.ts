export interface CreateCategoryCommandInput {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
}

export class CreateCategoryCommand {
  constructor(readonly data: CreateCategoryCommandInput) {}
}
