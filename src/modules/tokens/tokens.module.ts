import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensRepository } from './tokens.repository';
import { TokensSchedule } from './tokens.schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokensRepository]),
  ],
  providers: [TokensSchedule],
  exports: [TypeOrmModule],
})
export class TokensModule {}
