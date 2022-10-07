import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
import { clearDatabase, createSuperUser } from './test-helpers';
import { scrypt as _scrypt } from 'crypto';
import { faker } from '@faker-js/faker';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const url = '/auth/signout';

describe('/auth/signout: Controller (e2e)', () => {
  let app: INestApplication;
  let response: request.Response;
  let cookie;

  const email = faker.internet.email();
  const password = faker.internet.password();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    return getConnection().close();
  });

  it('should return 201 status code', async () => {
    await createSuperUser(email, password);

    response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    cookie = response.get('Set-Cookie');

    response = await request(app.getHttpServer())
      .post(url)
      .set('Cookie', cookie)
      .expect(201);

    cookie = response.get('Set-Cookie');

    await request(app.getHttpServer())
      .get('/person/all')
      .set('Cookie', cookie)
      .expect(403);
  });
});
