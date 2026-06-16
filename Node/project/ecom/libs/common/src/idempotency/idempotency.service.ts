import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface IdempotencyRecord<T = unknown> {
  status: 'IN_PROGRESS' | 'COMPLETED';
  response?: T;
}

/**
 * Idempotency store backed by Redis.
 *
 * Pattern (see LLD: Idempotency):
 *  - Client sends an `Idempotency-Key` header for mutating requests.
 *  - First request: SET NX -> marks IN_PROGRESS, executes handler, stores
 *    response COMPLETED with TTL.
 *  - Retries with same key: return the stored response instead of re-executing
 *    (no double charge / double booking).
 */
@Injectable()
export class IdempotencyService {
  private readonly ttlSeconds = 60 * 60 * 24; // 24h replay window

  constructor(private readonly redis: RedisService) {}

  private key(scope: string, id: string): string {
    return `idem:${scope}:${id}`;
  }

  /** Returns true if this is the first time we've seen the key (claim it). */
  async claim(scope: string, id: string): Promise<boolean> {
    const res = await this.redis.client.set(
      this.key(scope, id),
      JSON.stringify({ status: 'IN_PROGRESS' } as IdempotencyRecord),
      'EX',
      this.ttlSeconds,
      'NX',
    );
    return res === 'OK';
  }

  async get<T>(scope: string, id: string): Promise<IdempotencyRecord<T> | null> {
    const raw = await this.redis.client.get(this.key(scope, id));
    return raw ? (JSON.parse(raw) as IdempotencyRecord<T>) : null;
  }

  async complete<T>(scope: string, id: string, response: T): Promise<void> {
    await this.redis.client.set(
      this.key(scope, id),
      JSON.stringify({ status: 'COMPLETED', response } as IdempotencyRecord<T>),
      'EX',
      this.ttlSeconds,
    );
  }

  /** On failure, drop the claim so the client can legitimately retry. */
  async release(scope: string, id: string): Promise<void> {
    await this.redis.client.del(this.key(scope, id));
  }
}
