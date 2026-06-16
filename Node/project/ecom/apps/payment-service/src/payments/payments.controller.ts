import {
  Body,
  Controller,
  Param,
  Post,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { IDEMPOTENT_SCOPE, IdempotencyInterceptor } from '@app/common';
import { PaymentsService } from './payments.service';
import { ChargeDto } from './dto/charge.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('charge')
  @UseInterceptors(IdempotencyInterceptor)
  @SetMetadata(IDEMPOTENT_SCOPE, 'charge')
  charge(@Body() dto: ChargeDto) {
    return this.payments.charge(dto);
  }

  @Post(':id/refund')
  refund(@Param('id') id: string) {
    return this.payments.refund(id);
  }
}
