import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import { HttpClientService } from '../clients/http-client.service';
import { Booking, CreateBookingInput } from './models';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly http: HttpClientService) {}

  @Query(() => Booking, { nullable: true })
  async booking(@Args('id') id: string): Promise<Booking | null> {
    return this.http.request<Booking>('booking', `/bookings/${id}`);
  }

  /**
   * Kicks off the booking SAGA in booking-service. An Idempotency-Key is
   * generated per request so client retries never double-book / double-charge.
   */
  @Mutation(() => Booking)
  async createBooking(
    @Args('input') input: CreateBookingInput,
  ): Promise<Booking> {
    return this.http.request<Booking>('booking', '/bookings', {
      method: 'POST',
      body: JSON.stringify(input),
      idempotencyKey: randomUUID(),
    });
  }

  @Mutation(() => Booking)
  async cancelBooking(@Args('id') id: string): Promise<Booking> {
    return this.http.request<Booking>('booking', `/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }
}
