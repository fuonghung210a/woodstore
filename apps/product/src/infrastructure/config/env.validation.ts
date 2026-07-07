export interface EnvConfig {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
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

  if (errors.length > 0) {
    throw new Error(`Invalid environment variables: ${errors.join(', ')}`);
  }

  return {
    DATABASE_URL: databaseUrl as string,
    NODE_ENV: (config.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: Number(config.PORT) || 3001,
  };
}
