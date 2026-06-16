/**
 * Locking strategy catalog (see LLD: Concurrent seat booking).
 *
 * 1. DISTRIBUTED (Redis)      -> fast, cross-process, used as the first gate
 *                               before touching the DB. Implemented here.
 * 2. PESSIMISTIC (DB row lock)-> SELECT ... FOR UPDATE inside a tx. Implemented
 *                               in booking-service SeatRepository.
 * 3. OPTIMISTIC (version col) -> compare-and-swap on a `version` column; retry
 *                               on conflict. Implemented in booking-service.
 */
export enum LockStrategy {
  DISTRIBUTED = 'DISTRIBUTED',
  PESSIMISTIC = 'PESSIMISTIC',
  OPTIMISTIC = 'OPTIMISTIC',
}

export interface AcquiredLock {
  key: string;
  token: string;
  release: () => Promise<void>;
}

export class LockAcquisitionError extends Error {
  constructor(key: string) {
    super(`Could not acquire lock for "${key}"`);
    this.name = 'LockAcquisitionError';
  }
}
