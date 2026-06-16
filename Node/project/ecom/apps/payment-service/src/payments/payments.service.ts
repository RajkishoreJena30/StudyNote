import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { KAFKA_TOPICS, KafkaProducerService } from '@app/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from '../gateways/gateway.factory';
import { ChargeDto } from './dto/charge.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly factory: GatewayFactory,
    private readonly kafka: KafkaProducerService,
  ) {}

  /**
   * Charge through the selected gateway (Adapter pattern).
   * Idempotency is enforced at TWO levels:
   *  - HTTP interceptor (Redis) short-circuits replays
   *  - DB unique constraint on idempotencyKey is the durable backstop
   */
  async charge(dto: ChargeDto) {
    // Durable idempotency: if we already processed this key, return it.
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });
    if (existing) {
      return {
        paymentId: existing.id,
        status: existing.status === 'SUCCEEDED' ? 'SUCCEEDED' : 'FAILED',
      };
    }

    const gateway = this.factory.get(dto.provider);
    const result = await gateway.charge({
      amount: dto.amount,
      currency: dto.currency,
      reference: dto.bookingId,
    });

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        userId: dto.userId,
        amount: dto.amount,
        currency: dto.currency,
        provider: dto.provider,
        providerRef: result.providerRef || null,
        status: result.status,
        idempotencyKey: dto.idempotencyKey,
      },
    });

    await this.kafka.emit(
      result.status === 'SUCCEEDED'
        ? KAFKA_TOPICS.PAYMENT_SUCCEEDED
        : KAFKA_TOPICS.PAYMENT_FAILED,
      dto.bookingId,
      {
        eventId: randomUUID(),
        correlationId: dto.bookingId,
        occurredAt: new Date().toISOString(),
        bookingId: dto.bookingId,
        paymentId: payment.id,
        status: result.status,
        reason: result.reason,
      },
    );

    return {
      paymentId: payment.id,
      status: result.status,
      reason: result.reason,
    };
  }

  async refund(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === 'REFUNDED') return payment;

    if (payment.providerRef) {
      await this.factory.get(payment.provider).refund(payment.providerRef);
    }
    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });
    await this.kafka.emit(KAFKA_TOPICS.PAYMENT_REFUNDED, payment.bookingId, {
      eventId: randomUUID(),
      correlationId: payment.bookingId,
      occurredAt: new Date().toISOString(),
      bookingId: payment.bookingId,
      paymentId: payment.id,
      status: 'REFUNDED',
    });
    return updated;
  }
}
