import { INestApplication, Logger } from '@nestjs/common';

/**
 * Wire graceful shutdown for any Nest app.
 *
 * On SIGTERM/SIGINT we:
 *  1. stop accepting new traffic (Nest closes the HTTP server)
 *  2. run onModuleDestroy/beforeApplicationShutdown hooks (Kafka/Redis/Prisma
 *     disconnect, in-flight consumers drain)
 *  3. exit cleanly
 *
 * `enableShutdownHooks()` makes Nest forward OS signals to lifecycle hooks.
 * See LLD: "Graceful Shutdown".
 */
export function setupGracefulShutdown(app: INestApplication): void {
  const logger = new Logger('Shutdown');
  app.enableShutdownHooks();

  const shutdown = async (signal: string) => {
    logger.warn(`Received ${signal}, draining...`);
    try {
      await app.close(); // triggers lifecycle hooks + closes server
      logger.log('Shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error(`Error during shutdown: ${(err as Error).message}`);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  // Force-exit safety net if drain hangs
  process.on('SIGTERM', () => setTimeout(() => process.exit(1), 15_000).unref());
}
