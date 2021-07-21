import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IInfo } from './interfaces/info.interface';

@Injectable()
export class PingService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  ping(): void {
    return null;
  }

  info(): IInfo {
    const name: string = this.configService.get('name');
    const version: string = this.configService.get('version');
    const port: number = this.configService.get('port');

    return {
      pid: process.pid,
      name,
      version,
      port,
      uptime: process.uptime(),
    } as IInfo;
  }
}
