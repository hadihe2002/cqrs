import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { clearDatabase } from './test-helpers';
import { SuperUser } from '../src/entities/superuser';
import { faker } from '@faker-js/faker';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const url = '/auth/signup';

describe('/auth/signup: Controller (e2e)', () => {
  let app: INestApplication;
  let superuserRepo: Repository<SuperUser>;

  const email = faker.internet.email();
  const password = faker.internet.password();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    superuserRepo = getConnection().getRepository(SuperUser);
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    return getConnection().close();
  });

  it('should return 201 status code', async () => {
    const { body } = await request(app.getHttpServer())
      .post(url)
      .send({ email, password })
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(body.email);
    expect(body.password).not.toBeDefined();

    const superuser = await superuserRepo.findOne({ where: { email } });

    expect(superuser).toBeDefined();

    const [salt, hashed] = superuser.password.split('.');
    const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');

    expect(superuser.id).toEqual(body.id);
    expect(superuser.email).toEqual(email);
    expect(superuser.password).not.toEqual(password);
    expect(hash).toEqual(hashed);
  });

  it('should return 400 status code if email is alredy in use', async () => {
    await request(app.getHttpServer())
      .post(url)
      .send({ email, password })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .post(url)
      .send({ email, password });

    expect(body.statusCode).toEqual(400);
    expect(body.message).toEqual('this email is alredy in use!');
  });

  it('should return 400 status code if email is not an email', async () => {
    const { body } = await request(app.getHttpServer())
      .post(url)
      .send({ email: 'abcd', password });

    expect(body.statusCode).toEqual(400);
    expect(body.message[0]).toEqual('email must be an email');
  });
});
