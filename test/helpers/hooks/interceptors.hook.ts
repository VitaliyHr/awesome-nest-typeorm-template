import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ResponseInterceptor } from '~common/interceptors/response.interceptor';

export function interceptorsHook(app: INestApplication) {
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
}
