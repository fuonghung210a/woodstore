import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PaginatedResult } from '../../domain/post-types';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostStatus } from '../../domain/post-types';
import { ListPostsQuery } from '../queries/list-posts.query';

@QueryHandler(ListPostsQuery)
export class ListPostsHandler implements IQueryHandler<ListPostsQuery> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(query: ListPostsQuery): Promise<PaginatedResult<PostEntity>> {
    return this.postRepository.findAll(
      {
        search: query.filter.search,
        status: query.filter.status as PostStatus | undefined,
        tag: query.filter.tag,
      },
      query.pagination,
    );
  }
}
