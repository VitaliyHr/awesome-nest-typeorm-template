import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { imageSize } from 'image-size';

import { User } from '~modules/users/user.entity';
import { LoggerService } from '~core/logger/logger.service';

import { Upload } from './upload.entity';
import { UploadsRepository } from './uploads.repository';
import { UploadStoreAction } from '~core/upload-store/enums/upload-store-service.action';
import { UploadStoreService } from '~core/upload-store/upload-store.service';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadsRepository: UploadsRepository,
    private readonly loggerService: LoggerService,
    private readonly uploadStore: UploadStoreService,
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

  async create({ image, user }: ICreateUpload): Promise<Upload> {
    const response = await this.uploadStore
      .request({ action: UploadStoreAction.CREATE, image });

    if (response.status !== 201 || !_.has(response.headers, 'location')) {
      const message = 'Failed to upload image';
      throw new InternalServerErrorException(message);
    }

    const location = _.get<string>(response.headers, 'location', null);

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

    Object.assign(uploadPayload, { user: user.id });

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

  async update({ uploadId, user, image }: IUpdateUpload): Promise<void> {
    let upload: Upload;

    try {
      upload = await this.uploadsRepository.findOne({
        where: [{
          id: uploadId,
          user: user.id,
        }, {
          id: uploadId,
          canDelete: true,
        }],
      });
    } catch (error) {
      const message = 'Failed to find upload';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!upload) {
      const message = 'Upload not found';
      throw new NotFoundException(message);
    }

    const response = await this.uploadStore
      .request({ action: UploadStoreAction.UPDATE, image });

    if (response.status !== 204) {
      const message = 'Failed to delete image';
      throw new InternalServerErrorException(message);
    }

    const { width, height } = this.getUploadDimensions(image);

    const uploadPayload: Partial<Upload> = {
      width,
      height,
      size: image.size,
      filename: image.originalname,
      mimetype: image.mimetype,
      extension: image.mimetype.split('/')[1],
    };

    try {
      await this.uploadsRepository.update({ id: uploadId }, uploadPayload);
    } catch (error) {
      const message = 'Failed to update upload';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }
  }

  async delete({ uploadId }: IDeleteUpload): Promise<void> {
    let upload: Upload;

    try {
      upload = await this.uploadsRepository.findOne({
        where: {
          id: uploadId,
        },
        relations: ['user'],
      });
    } catch (error) {
      const message = 'Failed to find upload';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!upload) {
      const message = 'Upload not found';
      throw new NotFoundException(message);
    }

    const response = await this.uploadStore
      .request({ action: UploadStoreAction.DELETE, location: upload.location });

    if (response.status !== 204) {
      const message = 'Failed to delete image';
      throw new InternalServerErrorException(message);
    }

    try {
      await this.uploadsRepository.softRemove(upload);
    } catch (error) {
      const message = 'Failed to delete image';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }
  }
}

interface ICreateUpload {
  image: Express.Multer.File,
  user: User,
}

interface IUpdateUpload {
  uploadId: string,
  user: User,
  image: Express.Multer.File,
}

interface IDeleteUpload {
  uploadId: string,
}
