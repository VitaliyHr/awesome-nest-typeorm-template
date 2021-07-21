import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { imageSize } from 'image-size';
import { AxiosResponse, Method } from 'axios';
import { ConfigService } from '@nestjs/config';

import { User } from '~modules/users/user.entity';
import { LoggerService } from '~core/logger/logger.service';

import { Upload } from './upload.entity';
import { UploadsRepository } from './uploads.repository';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadsRepository: UploadsRepository,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.loggerService.setContext(UploadsService.name);
  }

  getUploadDimensions(image: Express.Multer.File): { width: number, height: number } {
    let height: number;
    let width: number;
    try {
      height = imageSize(image.buffer).height;
      width = imageSize(image.buffer).width;
    } catch (error) {
      const message = 'Failed to get dimensions from file';
      this.loggerService.error(message, error);
    }

    return {
      height,
      width,
    };
  }

  async saveUploadToStore(image: Express.Multer.File): Promise<string> {
    const url: string = this.configService.get('thumbor.url');
    const method: Method = this.configService.get('thumbor.method.create');

    let response: AxiosResponse;
    try {
      response = await this.httpService.request({
        data: image.buffer,
        url,
        method,
      }).toPromise();
    } catch (error) {
      const message = 'Failed to upload image';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (response.status !== 201 || !_.has(response.headers, 'location')) {
      const message = 'Failed to upload image';
      throw new InternalServerErrorException(message);
    }

    return _.get<string>(response.headers, 'location', null);
  }

  async create({ image, user }: ICreateUpload): Promise<Upload> {
    const location = await this.saveUploadToStore(image);

    const { width, height } = this.getUploadDimensions(image);

    const uploadPayload: Partial<Upload> = {
      width,
      height,
      location,
      size: image.size,
      filename: image.originalname,
      mimetype: image.mimetype,
      extension: image.mimetype.split('/')[1],
    };

    Object.assign(uploadPayload, { userId: user.id });

    let upload: Upload;
    try {
      upload = await this.uploadsRepository.create(uploadPayload).save();
    } catch (error) {
      const message = 'Failed to save upload';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    this.loggerService.log(`New upload created: ${upload.id}`);

    return upload;
  }
}

interface ICreateUpload {
  image: Express.Multer.File,
  user: User,
}
