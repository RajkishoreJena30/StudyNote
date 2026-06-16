import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Singleton Redis client used for caching, distributed locks and idempotency.
 * Exposes raw client plus a couple of safe helpers.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });
  }

  onModuleInit(): void {
    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('error', (e) => this.logger.error(`Redis error: ${e.message}`));
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  /** Cache-aside helper: get JSON or compute + set with TTL. */
  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.client.get(key);
    if (cached) return JSON.parse(cached) as T;
    const value = await factory();
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}
