import { ApiProperty } from '@nestjs/swagger';
import {
  IsObject,
} from 'class-validator';

export class UploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsObject()
  image: Express.Multer.File;
}
