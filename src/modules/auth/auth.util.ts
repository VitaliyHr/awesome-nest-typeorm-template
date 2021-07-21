import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { LoggerService } from '~core/logger/logger.service';

@Injectable()
export class AuthUtil {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly jwtService: JwtService,
  ) {
    this.loggerService.setContext(AuthUtil.name);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds: number = this.configService.get('auth.salt');

    let salt: string;
    try {
      salt = await bcrypt.genSalt(+saltRounds);
    } catch (error) {
      const message = 'Failed to hash password';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
      const message = 'Failed to hash user\'s password';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    return hashedPassword;
  }

  async comparePassword(password: string | Buffer, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  signToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
