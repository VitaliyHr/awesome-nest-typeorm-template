import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { DatabaseModule } from '~core/database/database.module';

@Module({
  controllers: [HealthController],
  imports: [
    DatabaseModule,
    TerminusModule,
  ],
})
export class HealthModule {}
