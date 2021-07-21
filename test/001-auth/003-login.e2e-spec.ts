import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '~app-module';
import { pipesHook } from '../helpers/hooks/pipes.hook';
import { filtersHook } from '../helpers/hooks/filters.hook';
import { interceptorsHook } from '../helpers/hooks/interceptors.hook';

describe('Login', () => {
  let app: INestApplication;
  const url = '/auth/login';

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

  it('Successfully login owner', () => {
    const payload = {
      email: 'test@gmail.com',
      password: '1111',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(201)
      .expect({
        success: true,
      });
  });

  it('Try to login owner with invalid credentials', () => {
    const payload = {
      email: 'test@gmail.com',
      password: 'invaild password',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(400)
      .expect({
        success: false,
        error: {
          statusCode: 400,
          message: 'User already exist',
        },
      });
  });

  it('Successfully login owner by phone number', () => {
    const payload = {
      email: 'invalidemail',
    };

    return request(app.getHttpServer())
      .post(url)
      .send(payload)
      .expect(400)
      .expect({
        success: false,
        error: {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
      });
  });

  it('Try to login owner without body', () => request(app.getHttpServer())
      .post(url)
      .expect(400)
      .expect({
        success: false,
        error: {
        statusCode: 400,
        message: [
          'email must be an email',
          'email must be a string',
          'email should not be empty',
        ],
        error: 'Bad Request',
      },
      }));

  afterAll(async () => {
    await app.close();
  });
});
