import {
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '~modules/users/user.entity';
import { GetUser } from '~common/decorators/get-user.decorator';

import { UploadsService } from './uploads.service';
import { UploadDto } from './dto/create-upload.dto';
import { Auth } from '~common/decorators/auth.decorator';
import { UploadIdDto } from './dto/upload-id.dto';

@ApiTags('uploads')
@Auth()
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: UploadDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.uploadsService.create({ image, user });
  }

  @Put(':uploadId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: UploadDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @GetUser() user: User,
    @Param() { uploadId }: UploadIdDto,
  ): Promise<void> {
    return this.uploadsService.update({ image, user, uploadId });
  }

  @Delete(':uploadId')
  async delete(
    @Param() { uploadId }: UploadIdDto,
  ): Promise<void> {
    return this.uploadsService.delete({ uploadId });
  }
}
