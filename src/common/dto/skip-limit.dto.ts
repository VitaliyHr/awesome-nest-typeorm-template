import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';

export class SkipLimitDto {
  @ApiPropertyOptional({
    example: 10,
    required: false,
    type: 'number',
    description: 'Sets how many records should be skipped',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  skip: number;

  @ApiPropertyOptional({
    example: 10,
    required: false,
    type: 'number',
    description: 'Sets max of records you want to get',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  limit: number;
}
