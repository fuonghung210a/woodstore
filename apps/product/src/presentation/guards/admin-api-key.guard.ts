import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

type RequestWithAdminSession = {
  method: string;
  originalUrl?: string;
  headers: Record<string, string | string[] | undefined>;
  session?: { adminUser?: unknown };
};

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Public catalog reads remain public. Every write must either originate from
 * the authenticated AdminJS session or provide the deployment-only API key.
 */
@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAdminSession>();

    if (
      SAFE_METHODS.has(request.method) ||
      request.originalUrl?.startsWith('/admin') ||
      request.session?.adminUser
    ) {
      return true;
    }

    const suppliedKey = request.headers['x-admin-api-key'];
    const apiKey = Array.isArray(suppliedKey) ? suppliedKey[0] : suppliedKey;
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      throw new UnauthorizedException('An admin API key is required');
    }

    return true;
  }
}
