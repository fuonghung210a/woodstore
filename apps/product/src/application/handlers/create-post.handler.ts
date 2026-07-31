import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostStatus } from '../../domain/post-types';
import { CreatePostCommand } from '../commands/create-post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostEntity> {
    const dto = command.data;

    return this.postRepository.create({
      title: dto.title,
      slug: dto.slug,
      content: dto.content,
      excerpt: dto.excerpt,
      coverImage: dto.coverImage,
      tags: dto.tags ?? [],
      status: (dto.status ?? 'DRAFT') as PostStatus,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      author: dto.author,
      relatedProductIds: dto.relatedProductIds ?? [],
    });
  }
}
