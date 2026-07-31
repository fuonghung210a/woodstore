import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import type { z } from 'zod';
import { createSchema } from 'zod-openapi';

/**
 * Converts a Zod schema into an OpenAPI request body schema.
 *
 * Usage:
 * @ApiZodBody(CreateProductSchema)
 */
export function ApiZodBody(schema: z.ZodTypeAny, description?: string) {
  const { schema: jsonSchema } = createSchema(schema);

  return applyDecorators(
    ApiBody({
      description,
      schema: jsonSchema as Record<string, unknown>,
    }),
  );
}
