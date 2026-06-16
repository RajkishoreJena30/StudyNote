import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma-clients/booking';
import { PrismaService } from '../prisma/prisma.service';

/**
 * SeatRepository — concrete home of the locking strategies.
 *
 * Concurrency problem: many users try to grab the same seat at the same time.
 * We must guarantee a seat is reserved by exactly one booking.
 *
 * Strategies (used together = defense in depth):
 *   1. DISTRIBUTED LOCK (Redis) — in BookingService, gates the critical section
 *      cheaply before we even open a DB transaction.
 *   2. PESSIMISTIC LOCK — `SELECT ... FOR UPDATE` inside a serializable-ish tx;
 *      the DB blocks competing transactions until this one commits.
 *   3. OPTIMISTIC LOCK — `version` column CAS; if another tx changed the row,
 *      our UPDATE affects 0 rows and we fail fast / retry.
 */
@Injectable()
export class SeatRepository {
  private readonly logger = new Logger(SeatRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * PESSIMISTIC strategy: lock the requested seats FOR UPDATE, verify they are
   * AVAILABLE, then mark them HELD — all in one transaction.
   */
  async reservePessimistic(
    bookingId: string,
    inventoryId: string,
    seatIds: string[],
    holdMs = 120_000,
  ): Promise<void> {
    await this.prisma.$transaction(
      async (tx) => {
        // Row-level write locks; competing txns block here until commit/rollback.
        const locked = await tx.$queryRaw<
          { id: string; status: string }[]
        >`SELECT id, status FROM seats
            WHERE id IN (${Prisma.join(seatIds)})
              AND "inventoryId" = ${inventoryId}
            FOR UPDATE`;

        if (locked.length !== seatIds.length) {
          throw new ConflictException('One or more seats do not exist');
        }
        const unavailable = locked.filter((s) => s.status !== 'AVAILABLE');
        if (unavailable.length > 0) {
          throw new ConflictException('One or more seats already taken');
        }

        const heldUntil = new Date(Date.now() + holdMs);
        await tx.seat.updateMany({
          where: { id: { in: seatIds } },
          data: { status: 'HELD', heldBy: bookingId, heldUntil },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    this.logger.debug(`Pessimistic hold for booking ${bookingId}`);
  }

  /**
   * OPTIMISTIC strategy: CAS each seat on (id, status, version). If the row was
   * changed concurrently the WHERE no longer matches and count !== 1.
   * Demonstrated as an alternative path (e.g. low-contention inventories).
   */
  async reserveOptimistic(
    bookingId: string,
    seatIds: string[],
    holdMs = 120_000,
  ): Promise<void> {
    const heldUntil = new Date(Date.now() + holdMs);
    for (const seatId of seatIds) {
      const seat = await this.prisma.seat.findUnique({ where: { id: seatId } });
      if (!seat || seat.status !== 'AVAILABLE') {
        throw new ConflictException(`Seat ${seatId} not available`);
      }
      // CAS: only succeeds if version is unchanged since we read it.
      const result = await this.prisma.seat.updateMany({
        where: { id: seatId, version: seat.version, status: 'AVAILABLE' },
        data: {
          status: 'HELD',
          heldBy: bookingId,
          heldUntil,
          version: { increment: 1 },
        },
      });
      if (result.count !== 1) {
        throw new ConflictException(`Seat ${seatId} was grabbed concurrently`);
      }
    }
  }

  /** Confirm held seats -> BOOKED (called after payment succeeds). */
  async confirm(bookingId: string, seatIds: string[]): Promise<void> {
    await this.prisma.seat.updateMany({
      where: { id: { in: seatIds }, heldBy: bookingId, status: 'HELD' },
      data: { status: 'BOOKED', heldUntil: null, version: { increment: 1 } },
    });
  }

  /** COMPENSATION: release held seats back to AVAILABLE (saga rollback). */
  async release(bookingId: string, seatIds: string[]): Promise<void> {
    await this.prisma.seat.updateMany({
      where: { id: { in: seatIds }, heldBy: bookingId },
      data: {
        status: 'AVAILABLE',
        heldBy: null,
        heldUntil: null,
        version: { increment: 1 },
      },
    });
  }
}
