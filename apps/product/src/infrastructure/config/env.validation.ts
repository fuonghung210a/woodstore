export interface EnvConfig {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_COOKIE_SECRET?: string;
  ADMIN_API_KEY?: string;
  CORS_ORIGIN?: string;
  ENABLE_SWAGGER?: string;
}

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const errors: string[] = [];

  const databaseUrl = config.DATABASE_URL;
  if (!databaseUrl || typeof databaseUrl !== 'string') {
    errors.push('DATABASE_URL is required and must be a string');
  }

  const nodeEnv = config.NODE_ENV;
  if (
    nodeEnv &&
    !['development', 'test', 'production'].includes(nodeEnv as string)
  ) {
    errors.push('NODE_ENV must be development, test, or production');
  }

  if (nodeEnv === 'production') {
    const requiredProductionSecrets = [
      'ADMIN_EMAIL',
      'ADMIN_PASSWORD',
      'ADMIN_COOKIE_SECRET',
      'ADMIN_API_KEY',
      'CORS_ORIGIN',
      'ACCESS_KEY',
      'SECRET_ACCESS_KEY',
      'S3_BUCKET_NAME',
      'REGION_NAME',
    ];
    for (const key of requiredProductionSecrets) {
      if (!config[key] || typeof config[key] !== 'string') {
        errors.push(`${key} is required in production`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid environment variables: ${errors.join(', ')}`);
  }

  return {
    DATABASE_URL: databaseUrl as string,
    NODE_ENV: (config.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: Number(config.PORT) || 3001,
    ADMIN_EMAIL: config.ADMIN_EMAIL as string | undefined,
    ADMIN_PASSWORD: config.ADMIN_PASSWORD as string | undefined,
    ADMIN_COOKIE_SECRET: config.ADMIN_COOKIE_SECRET as string | undefined,
    ADMIN_API_KEY: config.ADMIN_API_KEY as string | undefined,
    CORS_ORIGIN: config.CORS_ORIGIN as string | undefined,
    ENABLE_SWAGGER: config.ENABLE_SWAGGER as string | undefined,
  };
}
