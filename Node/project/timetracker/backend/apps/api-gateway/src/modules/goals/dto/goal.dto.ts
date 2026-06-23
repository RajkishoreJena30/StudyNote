import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 'Deep work daily' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ enum: GoalType, default: GoalType.DAILY })
  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType;

  @ApiProperty({ example: 120, description: 'Target focused minutes' })
  @IsInt()
  @IsPositive()
  targetMinutes!: number;
}

export class UpdateGoalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  targetMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class LogProgressDto {
  @ApiProperty({ example: 45, description: 'Minutes of focused work to log' })
  @IsInt()
  @IsPositive()
  minutes!: number;

  @ApiPropertyOptional({ example: '2026-06-23', description: 'Defaults to today' })
  @IsOptional()
  @IsISO8601()
  date?: string;
}
