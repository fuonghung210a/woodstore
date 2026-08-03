import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false }));

  const corsOrigin = process.env.CORS_ORIGIN;
  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    });
  }

  const config = new DocumentBuilder()
    .setTitle('WoodShop - Product Service')
    .setDescription('API quản lý sản phẩm đồ gỗ mỹ nghệ')
    .setVersion('0.1.0')
    .addTag('products')
    .build();

  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`Product service running on port ${port}`);
  Logger.log(`Swagger UI: http://localhost:${port}/api`);
}

bootstrap();
