import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsController } from './uploads.controller';
import { UploadsRepository } from './uploads.repository';
import { UploadsSchedule } from './uploads.schedule';
import { UploadsService } from './uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadsRepository])],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    UploadsSchedule,
  ],
  exports: [TypeOrmModule],
})
export class UploadsModule {}
