import { IsArray, IsIn, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  userId!: string;

  @IsString()
  eventInventoryId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  seatIds!: string[];

  @IsIn(['stripe', 'razorpay', 'paypal'])
  provider!: string;
}
