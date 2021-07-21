import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({ example: 'test@gmail.com', required: false })
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ example: '+380980000013', required: false })
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: '1111' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 22)
  password: string;
}
