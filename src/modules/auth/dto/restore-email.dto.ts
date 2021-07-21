import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RestoreEmailDto {
  @ApiProperty({ example: 'test1@gmail.com' })
  @IsUUID('4')
  token: string;
}
