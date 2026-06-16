import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter, CONSUMER_GROUPS, setupGracefulShutdown } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Attach a Kafka consumer transport (this service can also react to events).
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',') },
      consumer: { groupId: CONSUMER_GROUPS.USER },
    },
  });

  setupGracefulShutdown(app);
  await app.startAllMicroservices();
  const port = config.get('SERVICE_PORT', 3001);
  await app.listen(port);
  new Logger('UserService').log(`User service running on :${port}`);
}
void bootstrap();
