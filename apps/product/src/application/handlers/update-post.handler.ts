import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostStatus } from '../../domain/post-types';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { UpdatePostCommand } from '../commands/update-post.command';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(command: UpdatePostCommand): Promise<PostEntity> {
    const dto = command.data;

    const existing = await this.postRepository.findById(command.id);
    if (!existing) {
      throw new PostNotFoundException(command.id);
    }

    return this.postRepository.update(command.id, {
      title: dto.title,
      slug: dto.slug,
      content: dto.content,
      excerpt: dto.excerpt,
      coverImage: dto.coverImage,
      tags: dto.tags,
      status: dto.status as PostStatus | undefined,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      author: dto.author,
      relatedProductIds: dto.relatedProductIds,
      isActive: dto.isActive,
    });
  }
}
