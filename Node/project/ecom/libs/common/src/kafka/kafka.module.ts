import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaProducerService } from './kafka-producer.service';

/**
 * Global Kafka module — exposes the producer everywhere.
 * Consumers are wired per-service using NestJS microservice transports
 * (see each service's main.ts: connectMicroservice with Transport.KAFKA).
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
