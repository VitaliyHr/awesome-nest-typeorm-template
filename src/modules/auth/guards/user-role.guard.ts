import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from '~modules/users/user.entity';
import { UserRoleEnum } from '~modules/users/enums/user-role.enum';
import { ROLES_KEY } from '~common/decorators/user-role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles.length === 0) {
      return true;
    }

    const user = context.switchToHttp().getRequest<Request>().user as User;

    if (!user) {
      return false;
    }

    return requiredRoles.some((type) => user.role === type);
  }
}
