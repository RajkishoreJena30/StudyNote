import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChargeInput,
  GatewayChargeResult,
  PaymentGateway,
} from './payment-gateway.interface';

/**
 * Stripe adapter. Wraps the (mock) Stripe SDK behind the common interface.
 * Swap the body with real `stripe` calls in production.
 */
@Injectable()
export class StripeAdapter implements PaymentGateway {
  readonly name = 'stripe';
  private readonly logger = new Logger(StripeAdapter.name);

  constructor(private readonly config: ConfigService) {}

  async charge(input: ChargeInput): Promise<GatewayChargeResult> {
    this.logger.debug(`Stripe charge ${input.amount} ${input.currency}`);
    // const stripe = new Stripe(this.config.get('STRIPE_API_KEY'));
    // const intent = await stripe.paymentIntents.create({...});
    await this.simulateLatency();
    // Demo: decline amounts ending in .13 to exercise SAGA compensation.
    if (Math.round(input.amount * 100) % 100 === 13) {
      return { providerRef: '', status: 'FAILED', reason: 'card_declined' };
    }
    return { providerRef: `stripe_${Date.now()}`, status: 'SUCCEEDED' };
  }

  async refund(providerRef: string): Promise<void> {
    this.logger.debug(`Stripe refund ${providerRef}`);
  }

  private simulateLatency() {
    return new Promise((r) => setTimeout(r, 50));
  }
}
