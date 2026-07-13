import { UpdateProductInput } from '../../domain/types';

export class UpdateProductCommand {
  constructor(
    readonly id: string,
    readonly data: UpdateProductInput,
  ) {}
}
