import 'module-alias';

import * as ip from 'ip';
import * as helmet from 'helmet';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from '~app-module';
import { LoggerService } from '~core/logger/logger.service';
import { HttpExceptionFilter } from '~common/filters/exception.filter';
import { ResponseInterceptor } from '~common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Server'),
  });

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  let loggerService: LoggerService;
  try {
    loggerService = await app.resolve(LoggerService);
    loggerService.setContext('Server');
  } catch (e) {
    const error = 'Failed to init logger';
    throw new Error(error);
  }

  const isDev = configService.get<boolean>('isDev');
  const host = configService.get<string>('host');
  const port = configService.get<number>('port');
  const name = configService.get<string>('name');
  const mount = configService.get<string>('mount');
  const version = configService.get<string>('version');
  const uiDevHost = configService.get<string>('uiDevHost');

  if (isDev) {
    const origin = [
      uiDevHost,
      host,
      `http://localhost:${port}`,
      `http://127.0.0.1:${port}`,
    ];

    const lanIP = ip.address();
    if (lanIP) {
      origin.push(`http://${lanIP}:${port}`);
    }
    app.enableCors({ origin, credentials: true });
  }

  app.setGlobalPrefix(mount);
  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );

  const documentOptions = new DocumentBuilder()
    .setTitle(name)
    .setDescription('Doc about nest-typeorm template api and all needed info')
    .setVersion(version)
    .build();

  const docs = SwaggerModule.createDocument(app, documentOptions, {
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
  });

  if (isDev) {
    SwaggerModule.setup(`${mount}/doc`, app, docs);
  }

  await app.listen(port, () => {
    loggerService.log(`${name} v${version} is running on port:${port} ...`);
  });
}

void bootstrap();
