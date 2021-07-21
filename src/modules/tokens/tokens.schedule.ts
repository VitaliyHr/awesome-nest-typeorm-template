import * as moment from 'moment';
import { LessThan } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Token } from './token.entity';
import { TokensRepository } from './tokens.repository';
import { LoggerService } from '~core/logger/logger.service';

@Injectable()
export class TokensSchedule {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly tokensRepository: TokensRepository,
  ) {
    this.loggerService.setContext(TokensSchedule.name);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async expireTokens(): Promise<void> {
    this.loggerService.log('Starting cron job to cancel expired tokens...');

    let tokens: Token[];
    try {
      tokens = await this.tokensRepository.find({
        expireAt: LessThan(moment().toDate()),
      });
    } catch (error) {
      const message = 'Failed to find tokens';
      this.loggerService.error(message, error);
    }

    try {
      await this.tokensRepository.softRemove(tokens);
    } catch (error) {
      const message = 'Failed update tokens';
      this.loggerService.error(message, error);
    }

    this.loggerService.log(`Tottally entities updated: ${tokens.length}`);

    this.loggerService.log('Cron job finished');
  }
}
