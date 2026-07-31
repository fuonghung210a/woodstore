import { DomainError } from './domain-error.base';

export class PostNotFoundException extends DomainError {
  constructor(id: string) {
    super(`Post not found: ${id}`, 'POST_NOT_FOUND');
  }
}
