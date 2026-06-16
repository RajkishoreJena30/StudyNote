import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '../redis/redis.service';
import { AcquiredLock, LockAcquisitionError } from './lock.types';

/**
 * Redis-based distributed lock (single-node Redlock-style).
 *
 * - SET key token NX PX ttl  -> atomic acquire
 * - release uses a Lua CAS so we only delete the lock if we still own it
 *   (prevents deleting a lock that already expired and was re-acquired).
 *
 * This is strategy #1 (DISTRIBUTED) from LockStrategy. It is the cheap first
 * gate; the DB row lock (pessimistic) is the source of truth for correctness.
 */
@Injectable()
export class LockService {
  private readonly logger = new Logger(LockService.name);

  // Atomic "delete if I still own it"
  private static readonly RELEASE_SCRIPT = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end`;

  constructor(private readonly redis: RedisService) {}

  /**
   * Try to acquire `key` with bounded retries and jitter (avoids thundering herd).
   */
  async acquire(
    key: string,
    ttlMs = 10_000,
    retries = 5,
    retryDelayMs = 150,
  ): Promise<AcquiredLock> {
    const lockKey = `lock:${key}`;
    const token = randomUUID();

    for (let attempt = 0; attempt <= retries; attempt++) {
      const ok = await this.redis.client.set(
        lockKey,
        token,
        'PX',
        ttlMs,
        'NX',
      );
      if (ok === 'OK') {
        return {
          key: lockKey,
          token,
          release: () => this.release(lockKey, token),
        };
      }
      const jitter = Math.floor(Math.random() * retryDelayMs);
      await new Promise((r) => setTimeout(r, retryDelayMs + jitter));
    }
    throw new LockAcquisitionError(key);
  }

  /** Run `fn` while holding the lock; always releases (try/finally). */
  async withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttlMs = 10_000,
  ): Promise<T> {
    const lock = await this.acquire(key, ttlMs);
    try {
      return await fn();
    } finally {
      await lock.release();
    }
  }

  private async release(lockKey: string, token: string): Promise<void> {
    try {
      await this.redis.client.eval(
        LockService.RELEASE_SCRIPT,
        1,
        lockKey,
        token,
      );
    } catch (e) {
      this.logger.warn(`Lock release failed for ${lockKey}: ${(e as Error).message}`);
    }
  }
}
