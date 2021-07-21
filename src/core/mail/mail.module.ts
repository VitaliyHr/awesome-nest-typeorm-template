import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { MailListener } from './mail.listener';

const MailderDynamic = MailerModule.forRootAsync({
  imports: [ConfigModule, ConfigService],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('mail.host'),
      secure: false,
      auth: {
        user: configService.get<string>('mail.user'),
        pass: configService.get<string>('mail.password'),
      },
    },
    defaults: {
      from: `"No Reply" <${configService.get<string>('mail.from')}>`,
    },
    preview: false,
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
});

@Module({
  imports: [
    MailderDynamic,
    ConfigModule,
  ],
  providers: [MailListener],
  exports: [MailListener],
})
export class MailModule {}
