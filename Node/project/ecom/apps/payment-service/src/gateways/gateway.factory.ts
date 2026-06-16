import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  PAYMENT_GATEWAYS,
  PaymentGateway,
} from './payment-gateway.interface';

/**
 * Factory that resolves the right adapter at runtime by provider name.
 * New providers are registered in PaymentModule and become available here
 * automatically — no change to PaymentsService.
 */
@Injectable()
export class GatewayFactory {
  private readonly registry = new Map<string, PaymentGateway>();

  constructor(@Inject(PAYMENT_GATEWAYS) gateways: PaymentGateway[]) {
    for (const g of gateways) this.registry.set(g.name, g);
  }

  get(provider: string): PaymentGateway {
    const gateway = this.registry.get(provider);
    if (!gateway) {
      throw new BadRequestException(`Unsupported payment provider: ${provider}`);
    }
    return gateway;
  }

  list(): string[] {
    return [...this.registry.keys()];
  }
}
