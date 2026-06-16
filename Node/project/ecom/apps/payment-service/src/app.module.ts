import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  HealthController,
  IdempotencyInterceptor,
  IdempotencyService,
  KafkaModule,
  RedisModule,
  configuration,
} from '@app/common';
import { PrismaService } from './prisma/prisma.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { GatewayFactory } from './gateways/gateway.factory';
import { StripeAdapter } from './gateways/stripe.adapter';
import { RazorpayAdapter } from './gateways/razorpay.adapter';
import { PaypalAdapter } from './gateways/paypal.adapter';
import { PAYMENT_GATEWAYS } from './gateways/payment-gateway.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    KafkaModule,
    RedisModule,
  ],
  controllers: [HealthController, PaymentsController],
  providers: [
    PrismaService,
    PaymentsService,
    StripeAdapter,
    RazorpayAdapter,
    PaypalAdapter,
    // Collect all adapters into a single injectable array for the factory.
    {
      provide: PAYMENT_GATEWAYS,
      useFactory: (s: StripeAdapter, r: RazorpayAdapter, p: PaypalAdapter) => [
        s,
        r,
        p,
      ],
      inject: [StripeAdapter, RazorpayAdapter, PaypalAdapter],
    },
    GatewayFactory,
    IdempotencyService,
    IdempotencyInterceptor,
  ],
})
export class AppModule {}
