import { Method } from 'axios';
import { ConfigService } from '@nestjs/config';
import { LessThan, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService, Injectable } from '@nestjs/common';

import { Upload } from './upload.entity';
import { LoggerService } from '~core/logger/logger.service';
import { UploadsRepository } from './uploads.repository';

@Injectable()
export class UploadsSchedule {
  constructor(
    private readonly uploadsRepository: UploadsRepository,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.loggerService.setContext(UploadsSchedule.name);
  }

  async deleteUploadsFromStore(uploads: Upload[]): Promise<void> {
    const baseUrl: string = this.configService.get('thumbor.url');
    const method: Method = this.configService.get('thumbor.method.delete');

   await Promise.all(uploads.map(async (upload) => {
      const url = `${baseUrl}${upload.location}`;
      try {
        await this.httpService.request({
          url,
          method,
        }).toPromise();
      } catch (error) {
        const message = 'Failed to delete upload';
        this.loggerService.error(message, error);
      }
    }));
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async deleteUnusedUploads(): Promise<void> {
    this.loggerService.log('Starting cron job to delete uploads...');

    const attempts: number = this.configService.get('thumbor.delete.attempts');

    let uploads: Upload[];
    try {
      uploads = await this.uploadsRepository.find({
        where: {
          deletedFromDisk: false,
          deleteAttemptsCount: LessThanOrEqual(attempts),
          canDelete: true,
          lastDeleteAttemptAt: LessThan(new Date()),
        },
        withDeleted: true,
      });
    } catch (error) {
      const message = 'Failed to find uploads';
      this.loggerService.error(message, error);
    }

    await this.deleteUploadsFromStore(uploads);

    try {
      await this.uploadsRepository.update({
        deletedFromDisk: false,
        deleteAttemptsCount: LessThanOrEqual(attempts),
        canDelete: true,
      }, {
        deletedFromDisk: true,
        lastDeleteAttemptAt: new Date(),
      });
    } catch (error) {
      const message = 'Failed to update deleted uploads';
      this.loggerService.error(message, error);
    }

    try {
      await this.uploadsRepository.increment({
        deletedFromDisk: false,
        deleteAttemptsCount: LessThanOrEqual(attempts),
        canDelete: true,
      }, 'deleteAttemptsCount', 1);
    } catch (error) {
      const message = 'Failed to increment deleteAttemptsCount';
      this.loggerService.error(message, error);
    }

    this.loggerService.log(`Cron job finished. Totally uploads deleted: ${uploads.length}`);
  }
}
