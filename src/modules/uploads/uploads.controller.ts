import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '~modules/users/user.entity';
import { JwtAuthGuard } from '~modules/auth/guards/jwt.guard';
import { GetUser } from '~common/decorators/get-user.decorator';

import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload.dto';

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: CreateUploadDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.uploadsService.create({ image, user });
  }
}
