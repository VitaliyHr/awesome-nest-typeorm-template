import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsString, IsUUID, Length,
} from 'class-validator';

export class RestorePasswordDto {
  @ApiProperty({ example: 'ae078c49-522f-4cc6-b48b-cc86c7431f40' })
  @IsNotEmpty()
  @IsUUID('4')
  token: string;

  @ApiProperty({ example: '1111' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 22)
  password: string;
}
