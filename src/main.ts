import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // This is the way to whitelist the properties that are allowed to be sent to the server
      whitelist: true,
      // This is the way to forbid the properties that are not allowed to be sent to the server
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
