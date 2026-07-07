import { PrismaClient } from '@prisma/client';

export interface DbConfig {
  url: string;
  logLevel?: 'error' | 'warn' | 'info' | 'query';
}

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

export type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>;
