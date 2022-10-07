import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { clearDatabase, createPerson, createSuperUser } from './test-helpers';
import { faker } from '@faker-js/faker';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Person } from '../src/entities/person';
import { create } from 'domain';

const scrypt = promisify(_scrypt);
const url = '/person/delete';

describe('/person/delete/:id : Controller (e2e)', () => {
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

  it('sholud return 200 status code', async () => {
    const { id } = await createPerson(name, age);

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    const cookie = response.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .delete(`${url}/${id}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body.message).toEqual('Person was deleted successfully!');

    const person = await personRepo.findOne({ where: { id } });

    expect(person).toBeUndefined();
  });

  it('should return 400 if id is not a uuid', async () => {
    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const id = faker.datatype.number({ min: 1, max: 100 });

    await request(app.getHttpServer())
      .delete(url + '/' + id)
      .set('Cookie', cookie)
      .expect(400);
  });

  it('should return 404 status code if uuid does not exist', async () => {
    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const id = faker.datatype.uuid();

    const { body } = await request(app.getHttpServer())
      .delete(url + '/' + id)
      .set('Cookie', cookie)
      .expect(404);

    expect(body.message).toEqual("Person with this id doesn't exist");
  });

  it('should return 403 if you are not signed in', async () => {
    const id = faker.datatype.uuid();

    await request(app.getHttpServer())
      .delete(url + '/' + id)
      .expect(403);
  });
});
