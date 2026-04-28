// 1. External imports
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

// 2. Internal imports
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
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

void bootstrap();
