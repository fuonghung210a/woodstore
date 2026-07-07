import { DomainError } from './domain-error.base';

export class ProductNotFoundException extends DomainError {
  constructor(id: string) {
    super(`Product not found: ${id}`, 'PRODUCT_NOT_FOUND');
  }
}
