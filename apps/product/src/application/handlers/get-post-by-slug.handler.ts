import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { GetPostBySlugQuery } from '../queries/get-post-by-slug.query';

@QueryHandler(GetPostBySlugQuery)
export class GetPostBySlugHandler implements IQueryHandler<GetPostBySlugQuery> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(query: GetPostBySlugQuery): Promise<PostEntity> {
    const post = await this.postRepository.findBySlug(query.slug);

    if (!post) {
      throw new PostNotFoundException(query.slug);
    }

    return post;
  }
}
