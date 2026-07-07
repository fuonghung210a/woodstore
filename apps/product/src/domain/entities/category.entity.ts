export interface CategoryEntityProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly parentId: string | null;
  readonly sortOrder: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: CategoryEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description;
    this.parentId = props.parentId;
    this.sortOrder = props.sortOrder;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
