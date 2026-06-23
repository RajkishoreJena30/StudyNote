import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ description: 'The plan id to subscribe to' })
  @IsString()
  @IsUUID()
  planId!: string;
}
