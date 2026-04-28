// 1. External imports
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

// 2. Internal imports
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const corsOrigins = resolveCorsOrigins(configService.get<string>('CORS_ORIGIN'));
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
}

function resolveCorsOrigins(rawOrigins: string | undefined): string[] {
  if (!rawOrigins) {
    return ['http://localhost:5173'];
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

void bootstrap();
