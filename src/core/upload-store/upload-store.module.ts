import { Module } from '@nestjs/common';
import { UploadStoreService } from './upload-store.service';

@Module({
  imports: [],
  providers: [UploadStoreService],
  exports: [UploadStoreService],
})
export class UploadStoreModule {}
