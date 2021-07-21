import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '~modules/users/user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<User> => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
