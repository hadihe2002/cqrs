import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { clearDatabase, createSuperUser } from './test-helpers';
import { faker } from '@faker-js/faker';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Person } from '../src/entities/person';
import exp from 'constants';

const scrypt = promisify(_scrypt);
const url = '/person/save';

describe('/person/save: Controller (e2e)', () => {
  let app: INestApplication;
  let personRepo: Repository<Person>;

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

    personRepo = getConnection().getRepository(Person);
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
      .send({ name, age })
      .expect(201);

    const person = await personRepo.findOne({ where: { name } });

    expect(body.id).toEqual(person.id);
    expect(body.name).toEqual(person.name);
    expect(body.age).toEqual(person.age);

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const res = await request(app.getHttpServer())
      .get('/person/all')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body[0].id).toEqual(person.id);
    expect(res.body[0].name).toEqual(person.name);
    expect(res.body[0].age).toEqual(person.age);
  });

  it('should return 400 status code if age is not a number or name is not string', async () => {
    let response = await request(app.getHttpServer())
      .post(url)
      .send({ name: faker.datatype.boolean(), age })
      .expect(400);

    expect(response.body.message[0]).toContain('name must be a string');

    response = await request(app.getHttpServer())
      .post(url)
      .send({ name, age: faker.datatype.boolean() })
      .expect(400);

    expect(response.body.message[0]).toContain('age must be a number');
  });
});
