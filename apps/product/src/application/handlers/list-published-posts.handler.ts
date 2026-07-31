import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PaginatedResult } from '../../domain/post-types';
import { PostEntity } from '../../domain/entities/post.entity';
import { ListPublishedPostsQuery } from '../queries/list-published-posts.query';

@QueryHandler(ListPublishedPostsQuery)
export class ListPublishedPostsHandler
  implements IQueryHandler<ListPublishedPostsQuery>
{
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(
    query: ListPublishedPostsQuery,
  ): Promise<PaginatedResult<PostEntity>> {
    return this.postRepository.findPublished(query.pagination);
  }
}
