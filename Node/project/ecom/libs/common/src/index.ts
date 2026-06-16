// Barrel export for the shared @app/common library.
export * from './kafka/kafka.module';
export * from './kafka/kafka-producer.service';
export * from './kafka/topics';
export * from './kafka/events';

export * from './redis/redis.module';
export * from './redis/redis.service';

export * from './locking/lock.service';
export * from './locking/lock.types';

export * from './idempotency/idempotency.service';
export * from './idempotency/idempotency.interceptor';

export * from './saga/saga.types';
export * from './saga/saga-orchestrator';

export * from './filters/all-exceptions.filter';
export * from './interceptors/logging.interceptor';
export * from './health/health.controller';
export * from './shutdown/graceful-shutdown.service';
export * from './config/configuration';
