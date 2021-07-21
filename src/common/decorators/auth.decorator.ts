import {
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '~modules/auth/guards/jwt.guard';
import { RolesGuard } from '~modules/auth/guards/user-role.guard';
import { UserRoleEnum } from '~modules/users/enums/user-role.enum';

export function Auth(...roles: UserRoleEnum[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
