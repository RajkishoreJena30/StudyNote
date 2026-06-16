import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChargeInput,
  GatewayChargeResult,
  PaymentGateway,
} from './payment-gateway.interface';

/** PayPal adapter (mock). */
@Injectable()
export class PaypalAdapter implements PaymentGateway {
  readonly name = 'paypal';
  private readonly logger = new Logger(PaypalAdapter.name);

  constructor(private readonly config: ConfigService) {}

  async charge(input: ChargeInput): Promise<GatewayChargeResult> {
    this.logger.debug(`PayPal charge ${input.amount} ${input.currency}`);
    await new Promise((r) => setTimeout(r, 50));
    return { providerRef: `pp_${Date.now()}`, status: 'SUCCEEDED' };
  }

  async refund(providerRef: string): Promise<void> {
    this.logger.debug(`PayPal refund ${providerRef}`);
  }
}
