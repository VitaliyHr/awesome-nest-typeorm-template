import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class ConfirmRegisterDto {
  @ApiProperty({ example: 'ae078c49-522f-4cc6-b48b-cc86c7431f40' })
  @IsUUID('4')
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: '1111' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 22)
  password: string;

  @ApiPropertyOptional({ example: 'Jhon' })
  @IsOptional()
  @IsString()
  @Length(3, 22)
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @Length(3, 22)
  lastName: string;

  @ApiPropertyOptional({ example: '+380680000428' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'UA' })
  @IsOptional()
  @IsString()
  @IsISO31661Alpha2()
  lang: string;
}
