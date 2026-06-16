import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { IDEMPOTENT_SCOPE, IdempotencyInterceptor } from '@app/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  /**
   * Idempotent: the gateway sends an Idempotency-Key. A retried request
   * returns the original booking instead of starting a new SAGA.
   */
  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  @SetMetadata(IDEMPOTENT_SCOPE, 'create-booking')
  create(@Body() dto: CreateBookingDto) {
    return this.booking.createBooking(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booking.findById(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.booking.cancel(id);
  }
}
