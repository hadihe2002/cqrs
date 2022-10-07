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

const scrypt = promisify(_scrypt);
const url = '/person/update';

describe('/person/update/:id : Controller (e2e)', () => {
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

  it('should return 202 status code if both name and age get updated', async () => {
    const { id } = await createPerson(name, age);

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .patch(url + '/' + id)
      .send({ name: 'test', age: 20 })
      .set('Cookie', cookie)
      .expect(200);

    expect(body.name).toEqual('test');
    expect(body.age).toEqual(20);

    const person = await personRepo.findOne({ where: { id } });

    expect(person.name).toEqual('test');
    expect(person.age).toEqual(20);
  });

  it('should return 202 status code if just name get updated', async () => {
    const { id } = await createPerson(name, age);

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .patch(url + '/' + id)
      .send({ name: 'test', age })
      .set('Cookie', cookie)
      .expect(200);

    expect(body.name).toEqual('test');
    expect(body.age).toEqual(age);

    const person = await personRepo.findOne({ where: { id } });

    expect(person.name).toEqual('test');
    expect(person.age).toEqual(age);
  });

  it('should return 202 status code if just age get updated', async () => {
    const { id } = await createPerson(name, age);

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .patch(url + '/' + id)
      .send({ name, age: 20 })
      .set('Cookie', cookie)
      .expect(200);

    expect(body.name).toEqual(name);
    expect(body.age).toEqual(20);

    const person = await personRepo.findOne({ where: { id } });

    expect(person.name).toEqual(name);
    expect(person.age).toEqual(20);
  });

  it('should return 400 status code if id is not uuid', async () => {
    const id = faker.datatype.boolean();

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .patch(url + '/' + id)
      .send({ name, age })
      .set('Cookie', cookie)
      .expect(400);
  });

  it('should return 404 status code if uuid does not exist', async () => {
    const id = faker.datatype.uuid();

    await createSuperUser(email, password);

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .patch(url + '/' + id)
      .send({ name, age })
      .set('Cookie', cookie)
      .expect(404);

    expect(body.message).toEqual("Person with this id doesn't exist");
  });

  it('should return 403 status code', async () => {
    const id = faker.datatype.uuid();

    const { body } = await request(app.getHttpServer())
      .patch(url + '/' + id)
      .send({ name, age })
      .expect(403);

    expect(body.message).toEqual('Please signin as a superuser');
  });
});
