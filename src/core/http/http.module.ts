import { ResponseType } from 'axios';
import { HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export default HttpModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    responseType: configService.get<ResponseType>('http.responseType'),
    maxRedirects: configService.get<number>('http.maxRedirects'),
    timeout: configService.get<number>('http.timeout'),
    decompress: configService.get<boolean>('http.decompress'),
    maxBodyLength: configService.get<number>('http.maxBodyLength'),
    maxContentLength: configService.get<number>('http.maxContentLength'),
  }),
});
