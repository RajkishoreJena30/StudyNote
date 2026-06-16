import { IsIn, IsNumber, IsString, Min } from 'class-validator';

export class ChargeDto {
  @IsString()
  bookingId!: string;

  @IsString()
  userId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  currency!: string;

  @IsIn(['stripe', 'razorpay', 'paypal'])
  provider!: string;

  @IsString()
  idempotencyKey!: string;
}
