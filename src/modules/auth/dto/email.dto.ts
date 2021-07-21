import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @ApiProperty({ example: 'test@gmail.com', maxLength: 33 })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
