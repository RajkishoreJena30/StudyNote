import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ChargeRequest {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  idempotencyKey: string;
}

export interface ChargeResult {
  paymentId: string;
  status: 'SUCCEEDED' | 'FAILED';
  reason?: string;
}

/**
 * Synchronous call into payment-service for the SAGA "charge" step.
 * (The same flow can be driven asynchronously over Kafka — see LLD.)
 * Carries an Idempotency-Key so retries never double-charge.
 */
@Injectable()
export class PaymentClient {
  private readonly logger = new Logger(PaymentClient.name);

  constructor(private readonly config: ConfigService) {}

  async charge(req: ChargeRequest): Promise<ChargeResult> {
    const base = this.config.get<string>('services.payment')!;
    const res = await fetch(`${base}/payments/charge`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Idempotency-Key': req.idempotencyKey,
      },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new HttpException(body?.error ?? 'Payment failed', res.status);
    }
    return (await res.json()) as ChargeResult;
  }

  async refund(paymentId: string, idempotencyKey: string): Promise<void> {
    const base = this.config.get<string>('services.payment')!;
    await fetch(`${base}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'Idempotency-Key': idempotencyKey },
    }).catch((e) => this.logger.error(`Refund failed: ${e.message}`));
  }
}
