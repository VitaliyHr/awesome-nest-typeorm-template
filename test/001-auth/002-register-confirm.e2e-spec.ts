import { v4 as uuid } from 'uuid';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '~app-module';
import { pipesHook } from '../helpers/hooks/pipes.hook';
import { filtersHook } from '../helpers/hooks/filters.hook';
import { interceptorsHook } from '../helpers/hooks/interceptors.hook';

describe('Register', () => {
  let app: INestApplication;
  const url = '/auth/register/confirm';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
    pipesHook(app);
    filtersHook(app);
    interceptorsHook(app);

    await app.init();
  });

  it('Try to confirm unexisted owner', () => {
    const payload = {
      token: uuid(),
      password: '1111',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(404)
      .expect({
        success: false,
        error: {
          statusCode: 404,
          message: 'Token not found',
        },
      });
  });

  it('Try to confirm owner without password', () => {
    const payload = {
      token: 'tokens',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(400)
      .expect({
        success: false,
        error: {
          statusCode: 400,
          message: [
            'password must be a string',
            'password should not be empty',
          ],
          error: 'Bad Request',
        },
      });
  });

  it('Try to confirm owner without token', () => {
    const payload = {
      password: '1111',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(400)
      .expect({
        success: false,
        error: {
          statusCode: 400,
          message: [
            'token must be a string',
            'token should not be empty',
          ],
          error: 'Bad Request',
        },
      });
  });

  it('Successfully confirm regstered owner', () => {
    const payload = {
      password: '1111',
      token: '',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(201)
      .expect({
        success: true,
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
