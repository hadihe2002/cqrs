import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
import { clearDatabase, createSuperUser } from './test-helpers';
import { faker } from '@faker-js/faker';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const url = '/auth/signin';

describe('/auth/signin: Controller (e2e)', () => {
  let app: INestApplication;

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

    const response = await request(app.getHttpServer())
      .post(url)
      .send({ email, password })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    expect(response.body.id).toBeDefined();
    expect(response.body.email).toEqual(email);
    expect(response.body.password).not.toBeDefined();

    await request(app.getHttpServer())
      .get('/person/all')
      .set('Cookie', cookie)
      .expect(200);
  });

  it('should return 400 status code if password is incorrect', async () => {
    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post(url)
      .send({ email, password: faker.internet.password() });

    expect(response.body.message).toEqual('email or password was incorrect!');
  });

  it('should return 400 status code if email is incorrect', async () => {
    const response = await request(app.getHttpServer()).post(url).send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response.body.message).toEqual('email or password was incorrect!');
  });

  it('should return 400 status code if email is not email', async () => {
    const response = await request(app.getHttpServer())
      .post(url)
      .send({ email: faker.random.word, password: faker.internet.password() });

    expect(response.body.message[0]).toEqual('email must be an email');
  });
});
