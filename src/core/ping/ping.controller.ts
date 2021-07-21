import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IInfo } from './interfaces/info.interface';
import { PingService } from './ping.service';

@ApiTags('ping')
@Controller()
export class PingController {
  constructor(
    private readonly pingService: PingService,
  ) {}

  @Get('info')
  getInfo(): IInfo {
    return this.pingService.info();
  }

  @Get('ping')
  ping(): void {
    return this.pingService.ping();
  }
}
