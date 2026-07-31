import { DomainError } from './domain-error.base';

export class CategoryNotFoundException extends DomainError {
  constructor(id: string) {
    super(`Category not found: ${id}`, 'CATEGORY_NOT_FOUND');
  }
}
