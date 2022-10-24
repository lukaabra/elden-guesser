import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './data/exceptions/http-exception.filter';
import { NotFoundExceptionFilter } from './data/exceptions/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new NotFoundExceptionFilter(),
  );
  await app.listen(8080);
}
bootstrap();
