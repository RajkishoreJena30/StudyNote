import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { SeatRepository } from './booking/seat.repository';
import { PaymentClient } from './booking/payment.client';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    KafkaModule,
    RedisModule, // provides RedisService + LockService
  ],
  controllers: [HealthController, BookingController],
  providers: [
    PrismaService,
    BookingService,
    SeatRepository,
    PaymentClient,
    IdempotencyService,
    IdempotencyInterceptor,
  ],
})
export class AppModule {}
