import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Partitioners, Producer } from 'kafkajs';
import { KafkaTopic } from './topics';

/**
 * Thin, reusable Kafka producer wrapper.
 * - idempotent producer (exactly-once-ish semantics on the broker side)
 * - graceful connect on boot / disconnect on shutdown
 * - JSON serialization with message key for partition affinity (ordering)
 */
@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'ecom'),
      brokers: this.config
        .get<string>('KAFKA_BROKERS', 'localhost:9092')
        .split(','),
      retry: { retries: 8, initialRetryTime: 300 },
    });
    this.producer = this.kafka.producer({
      idempotent: true,
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Kafka producer disconnected');
  }

  /**
   * Emit a domain event. `key` controls partitioning — use the aggregate id
   * (e.g. bookingId) so all events for one booking land on the same partition
   * and are processed in order.
   */
  async emit<T extends object>(
    topic: KafkaTopic,
    key: string,
    payload: T,
  ): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(payload),
          headers: { 'content-type': 'application/json' },
        },
      ],
    });
    this.logger.debug(`-> ${topic} key=${key}`);
  }
}
