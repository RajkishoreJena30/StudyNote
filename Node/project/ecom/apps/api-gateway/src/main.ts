import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter, setupGracefulShutdown } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  setupGracefulShutdown(app);

  const port = process.env.SERVICE_PORT ?? 3000;
  await app.listen(port);
  new Logger('Gateway').log(
    `API Gateway running on :${port} (GraphQL at /graphql)`,
  );
}
void bootstrap();
