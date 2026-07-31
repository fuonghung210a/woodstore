import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './infrastructure/config/env.validation';
import { ProductInfrastructureModule } from './infrastructure/database.module';
import { AdminPanelModule } from './infrastructure/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ProductInfrastructureModule,
    AdminPanelModule,
  ],
})
export class AppModule {}
