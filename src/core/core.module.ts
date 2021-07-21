import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';

import { LoggerService } from './logger/logger.service';

import HttpModule from './http/http.module';
import ConfigModule from './config/config.module';
import { PingModule } from './ping/ping.module';
import { MailModule } from './mail/mail.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { ListenerModule } from './listener/listener.module';

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    DatabaseModule,
    ListenerModule,
    PassportModule,
    LoggerModule,
    MailModule,
    PingModule,
    HealthModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    LoggerService,
  ],
  exports: [
    LoggerModule,
    ListenerModule,
    ConfigModule,
    HttpModule,
  ],
})
export class CoreModule {}
