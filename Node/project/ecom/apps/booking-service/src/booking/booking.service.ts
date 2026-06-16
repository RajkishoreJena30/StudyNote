import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  KAFKA_TOPICS,
  KafkaProducerService,
  LockService,
  SagaOrchestrator,
  SagaState,
} from '@app/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeatRepository } from './seat.repository';
import { PaymentClient } from './payment.client';
import { CreateBookingDto } from './dto/create-booking.dto';

const SEAT_PRICE = 50; // flat demo price

/** Mutable context threaded through the SAGA steps. */
interface BookingSagaContext {
  bookingId: string;
  userId: string;
  inventoryId: string;
  seatIds: string[];
  amount: number;
  currency: string;
  provider: string;
  paymentId?: string;
}

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly seats: SeatRepository,
    private readonly payments: PaymentClient,
    private readonly kafka: KafkaProducerService,
    private readonly lock: LockService,
  ) {}

  /**
   * Orchestration SAGA:
   *   1. reserveSeats  (compensate: releaseSeats)
   *   2. charge        (compensate: refund)
   *   3. confirm       (no compensation needed — terminal success)
   *
   * The whole critical section is additionally guarded by a Redis distributed
   * lock keyed on the seats, so two concurrent requests for the same seats are
   * serialized before they ever reach the DB (strategy #1).
   */
  async createBooking(dto: CreateBookingDto): Promise<unknown> {
    const bookingId = randomUUID();
    const amount = dto.seatIds.length * SEAT_PRICE;

    const booking = await this.prisma.booking.create({
      data: {
        id: bookingId,
        userId: dto.userId,
        inventoryId: dto.eventInventoryId,
        seatIds: dto.seatIds,
        amount,
        provider: dto.provider,
        status: 'PENDING',
      },
    });

    await this.kafka.emit(KAFKA_TOPICS.BOOKING_CREATED, bookingId, {
      eventId: randomUUID(),
      correlationId: bookingId,
      occurredAt: new Date().toISOString(),
      bookingId,
      userId: dto.userId,
      eventInventoryId: dto.eventInventoryId,
      seatIds: dto.seatIds,
      amount,
      currency: booking.currency,
    });

    const ctx: BookingSagaContext = {
      bookingId,
      userId: dto.userId,
      inventoryId: dto.eventInventoryId,
      seatIds: dto.seatIds,
      amount,
      currency: booking.currency,
      provider: dto.provider,
    };

    // Distributed lock over the exact seat set (sorted for a stable key).
    const lockKey = `seats:${dto.eventInventoryId}:${[...dto.seatIds].sort().join(',')}`;

    const result = await this.lock.withLock(lockKey, async () => {
      const saga = new SagaOrchestrator<BookingSagaContext>(
        `booking:${bookingId}`,
        this.logger,
      )
        .addStep({
          name: 'reserveSeats',
          invoke: async (c) =>
            this.seats.reservePessimistic(c.bookingId, c.inventoryId, c.seatIds),
          compensate: async (c) => this.seats.release(c.bookingId, c.seatIds),
        })
        .addStep({
          name: 'charge',
          invoke: async (c) => {
            const charge = await this.payments.charge({
              bookingId: c.bookingId,
              userId: c.userId,
              amount: c.amount,
              currency: c.currency,
              provider: c.provider,
              idempotencyKey: `pay-${c.bookingId}`,
            });
            if (charge.status !== 'SUCCEEDED') {
              throw new Error(charge.reason ?? 'Payment declined');
            }
            c.paymentId = charge.paymentId;
          },
          compensate: async (c) => {
            if (c.paymentId) {
              await this.payments.refund(c.paymentId, `refund-${c.bookingId}`);
            }
          },
        })
        .addStep({
          name: 'confirmSeats',
          invoke: async (c) => this.seats.confirm(c.bookingId, c.seatIds),
          compensate: async () => undefined,
        });

      return saga.execute(ctx);
    });

    if (result.state === SagaState.COMPLETED) {
      const confirmed = await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED', paymentId: ctx.paymentId },
      });
      await this.kafka.emit(KAFKA_TOPICS.BOOKING_CONFIRMED, bookingId, {
        eventId: randomUUID(),
        correlationId: bookingId,
        occurredAt: new Date().toISOString(),
        bookingId,
        seatIds: dto.seatIds,
      });
      return confirmed;
    }

    // SAGA compensated -> mark failed.
    const failed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'FAILED', failureReason: result.error },
    });
    await this.kafka.emit(KAFKA_TOPICS.BOOKING_CANCELLED, bookingId, {
      eventId: randomUUID(),
      correlationId: bookingId,
      occurredAt: new Date().toISOString(),
      bookingId,
      reason: result.error ?? 'unknown',
    });
    return failed;
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async cancel(id: string) {
    const booking = await this.findById(id);
    if (booking.status === 'CONFIRMED' && booking.paymentId) {
      await this.payments.refund(booking.paymentId, `refund-${id}`);
    }
    await this.seats.release(id, booking.seatIds);
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
