import { IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  type: UserRoleEnum;
}
