/** Shared config loader. Centralizes env access with sane defaults. */
export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.SERVICE_PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID ?? 'ecom',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE ?? 'http://localhost:9200',
  },
  services: {
    user: process.env.USER_SERVICE_URL ?? 'http://localhost:3001',
    booking: process.env.BOOKING_SERVICE_URL ?? 'http://localhost:3002',
    payment: process.env.PAYMENT_SERVICE_URL ?? 'http://localhost:3003',
    search: process.env.SEARCH_SERVICE_URL ?? 'http://localhost:3004',
  },
});

export type AppConfig = ReturnType<typeof configuration>;
