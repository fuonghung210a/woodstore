import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './infrastructure/config/env.validation';
import { ProductInfrastructureModule } from './infrastructure/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ProductInfrastructureModule,
  ],
})
export class AppModule {}
