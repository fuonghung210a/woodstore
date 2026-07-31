import { PipeTransform, BadRequestException } from "@nestjs/common";
import { z } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        error: "VALIDATION_ERROR",
        message: z.treeifyError(result.error),
      });
    }
    return result.data;
  }
}
