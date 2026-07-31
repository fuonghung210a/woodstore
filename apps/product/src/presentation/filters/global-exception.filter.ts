import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/exceptions/domain-error.base';

/**
 * Global exception filter:
 * - DomainError → mapped HTTP status (via statusCode)
 * - HttpException → pass through (NestJS standard)
 * - Unknown → 500 Internal Server Error
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  // Map domain error code → HTTP status
  private static readonly DOMAIN_STATUS_MAP: Record<string, HttpStatus> = {
    PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
    CATEGORY_NOT_FOUND: HttpStatus.NOT_FOUND,
    POST_NOT_FOUND: HttpStatus.NOT_FOUND,
  };

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. Domain errors (from domain/application layer)
    if (exception instanceof DomainError) {
      const status =
        GlobalExceptionFilter.DOMAIN_STATUS_MAP[exception.code] ??
        HttpStatus.BAD_REQUEST;

      return response.status(status).json({
        statusCode: status,
        error: exception.code,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Standard NestJS HTTP exceptions (validation, not found routes...)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      return response.status(status).json(body);
    }

    // 3. Unexpected errors
    this.logger.error(
      `Unhandled exception: ${
        exception instanceof Error ? exception.stack : String(exception)
      }`,
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Đã xảy ra lỗi không mong muốn',
      timestamp: new Date().toISOString(),
    });
  }
}
