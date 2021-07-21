import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';

import { Token } from '~modules/tokens/token.entity';

@Injectable()
export class MailListener {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('user.register')
  sendRegisterToken(token: Token) {
    const host: string = this.configService.get('host');

    const url = `${host}/auth/register/confirm?token=${token.token}`;

    return this.mailerService.sendMail({
      to: token.email,
      subject: 'Hello from Project!',
      template: './register',
      context: { url },
    });
  }

  @OnEvent('password.reset')
  sendResetPassword(token: Token) {
    const host: string = this.configService.get('host');

    const url = `${host}/auth/password/restore?token=${token.token}`;

    return this.mailerService.sendMail({
      to: token.email,
      subject: 'Warning!',
      template: './reset-password',
      context: { url },
    });
  }

  @OnEvent('email.reset')
  sendResetEmail(token: Token) {
    const host: string = this.configService.get('host');

    const url = `${host}/auth/email/restore?token=${token.token}`;

    return this.mailerService.sendMail({
      to: token.email,
      subject: 'Warning!',
      template: './reset-email',
      context: { url },
    });
  }
}
