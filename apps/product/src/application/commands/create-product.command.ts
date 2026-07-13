import { CreateProductInput } from "../../domain/types";

export class CreateProductCommand {
  constructor(readonly data: CreateProductInput) {}
}
