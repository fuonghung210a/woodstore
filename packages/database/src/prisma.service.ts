import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionCallback, TransactionClient } from './types';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    return this.$transaction(
      async (tx) => callback(tx as unknown as TransactionClient),
    );
  }
}
