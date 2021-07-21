import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '~modules/users/user.entity';
import { UsersRepository } from '~modules/users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.secret'),
    });
  }

  async validate(req: any) {
    const id = _.get(req, 'id', '') as string;

    if (!id) {
      return null;
    }

    let user: User;
    try {
      user = await this.userService.findOne(id);
    } catch (error) {
      return null;
    }

    if (!user) {
      return null;
    }

    return user;
  }
}
