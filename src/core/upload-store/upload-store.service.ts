import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosResponse, Method } from 'axios';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '~core/logger/logger.service';
import { UploadStoreAction } from './enums/upload-store-service.action';

@Injectable()
export class UploadStoreService {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.loggerService.setContext(UploadStoreService.name);
  }

  async request({ action, image = null, location }: IRequest): Promise<AxiosResponse> {
    const baseUrl: string = this.configService.get('uploadStore.url');
    const mount: string = this.configService.get('uploadStore.mount');

    const dataMap = {
      create: {
        url: `${baseUrl}${mount}`,
        method: this.configService.get<string>('uploadStore.method.create') as Method,
        data: image?.buffer,
      },
      update: {
        url: `${baseUrl}${location}`,
        method: this.configService.get<string>('uploadStore.method.update') as Method,
        data: image?.buffer,
      },
      delete: {
        url: `${baseUrl}${location}`,
        method: this.configService.get<string>('uploadStore.method.delete') as Method,
      },
    };

    let response: AxiosResponse;
    try {
      response = await this.httpService.request(dataMap[action]).toPromise();
    } catch (error) {
      const message = 'Failed to upload image';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    return response;
  }
}

interface IRequest {
  action: UploadStoreAction,
  location?: string,
  image?: Express.Multer.File,
}
