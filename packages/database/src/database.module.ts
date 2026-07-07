import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DbConfig } from './types';

@Module({})
export class DatabaseModule {
  static forRoot(config: DbConfig): DynamicModule {
    const prismaProvider = {
      provide: PrismaService,
      useFactory: () =>
        new PrismaService({
          datasources: { db: { url: config.url } },
          log: config.logLevel ? [config.logLevel] : ['error'],
        }),
    };

    return {
      module: DatabaseModule,
      providers: [prismaProvider],
      exports: [PrismaService],
      global: true,
    };
  }
}
