import { IsOptional } from 'class-validator';

export class ModifyUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  phoneNumber: string;
}
