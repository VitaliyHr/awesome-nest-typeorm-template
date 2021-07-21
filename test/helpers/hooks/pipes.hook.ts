import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesHook(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
}
