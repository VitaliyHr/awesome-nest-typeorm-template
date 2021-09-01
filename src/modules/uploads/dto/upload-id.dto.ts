import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadIdDto {
  @ApiProperty({ example: 'ccb7c368-1558-4a37-bf97-58adce33fb6b' })
  @IsUUID('4')
  uploadId: string;
}
