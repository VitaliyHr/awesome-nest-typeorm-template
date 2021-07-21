import { INestApplication } from '@nestjs/common';

import { HttpExceptionFilter } from '~common/filters/exception.filter';

export function filtersHook(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}
