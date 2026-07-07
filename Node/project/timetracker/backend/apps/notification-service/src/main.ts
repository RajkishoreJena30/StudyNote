import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroserviceExceptionFilter } from '@app/common';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.NOTIFICATION_SERVICE_PORT ?? '4004', 10);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MicroserviceExceptionFilter());

  await app.listen();
  Logger.log(`Notification service listening on TCP port ${port}`, 'Bootstrap');
}

void bootstrap();