import { Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Booking {
  @Field(() => ID) id!: string;
  @Field() userId!: string;
  @Field() eventInventoryId!: string;
  @Field(() => [String]) seatIds!: string[];
  @Field(() => Float) amount!: number;
  @Field() currency!: string;
  @Field() status!: string;
  @Field({ nullable: true }) createdAt?: string;
}

@InputType()
export class CreateBookingInput {
  @Field() userId!: string;
  @Field() eventInventoryId!: string;
  @Field(() => [String]) seatIds!: string[];
  @Field() provider!: string; // stripe | razorpay | paypal
}

@ObjectType()
export class User {
  @Field(() => ID) id!: string;
  @Field() email!: string;
  @Field() name!: string;
}

@InputType()
export class RegisterUserInput {
  @Field() email!: string;
  @Field() name!: string;
  @Field() password!: string;
}

@ObjectType()
export class SearchHit {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() category!: string;
  @Field(() => Float) score!: number;
}
