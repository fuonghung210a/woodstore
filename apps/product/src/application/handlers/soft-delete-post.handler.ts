import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IPostRepository,
  IPostRepositoryType,
} from '../../domain/repositories/post-repository.interface';
import { PostNotFoundException } from '../../domain/exceptions/post-not-found.exception';
import { SoftDeletePostCommand } from '../commands/soft-delete-post.command';

@CommandHandler(SoftDeletePostCommand)
export class SoftDeletePostHandler
  implements ICommandHandler<SoftDeletePostCommand>
{
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepositoryType,
  ) {}

  async execute(command: SoftDeletePostCommand): Promise<void> {
    const existing = await this.postRepository.findById(command.id);
    if (!existing) {
      throw new PostNotFoundException(command.id);
    }

    await this.postRepository.softDelete(command.id);
  }
}
