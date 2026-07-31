import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { GetPostQuery } from '../queries/get-post.query';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(query: GetPostQuery): Promise<PostEntity> {
    const post = await this.postRepository.findById(query.id);

    if (!post) {
      throw new PostNotFoundException(query.id);
    }

    return post;
  }
}
