import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
import { clearDatabase, createPerson, createSuperUser } from './test-helpers';
import { faker } from '@faker-js/faker';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import exp from 'constants';

const scrypt = promisify(_scrypt);
const url = '/person/all';

describe('/person/all: Controller (e2e)', () => {
  let app: INestApplication;

  const name = faker.name.firstName();
  const age = faker.datatype.number({ min: 1, max: 100 });

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

  it('should return 200', async () => {
    await createPerson(name,age)

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get(url)
      .set('Cookie', cookie)
      .expect(200);

    expect(body[0].name).toEqual(name);
    expect(body[0].age).toEqual(age);
    expect(body[0].id).toBeDefined();
  });

  it('should return 403 code if Cookie is not set', async () => {
    const response = await request(app.getHttpServer()).get(url).expect(403);

    expect(response.body.message).toEqual('Please signin as a superuser');
  });
});
