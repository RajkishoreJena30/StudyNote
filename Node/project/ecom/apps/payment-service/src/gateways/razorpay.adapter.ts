import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChargeInput,
  GatewayChargeResult,
  PaymentGateway,
} from './payment-gateway.interface';

/** Razorpay adapter (mock). Same interface, different SDK semantics hidden. */
@Injectable()
export class RazorpayAdapter implements PaymentGateway {
  readonly name = 'razorpay';
  private readonly logger = new Logger(RazorpayAdapter.name);

  constructor(private readonly config: ConfigService) {}

  async charge(input: ChargeInput): Promise<GatewayChargeResult> {
    this.logger.debug(`Razorpay charge ${input.amount} ${input.currency}`);
    await new Promise((r) => setTimeout(r, 50));
    return { providerRef: `rzp_${Date.now()}`, status: 'SUCCEEDED' };
  }

  async refund(providerRef: string): Promise<void> {
    this.logger.debug(`Razorpay refund ${providerRef}`);
  }
}
