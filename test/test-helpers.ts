import { SuperUser } from '../src/entities/superuser';
import { getConnection } from 'typeorm';
import { Person } from '../src/entities/person';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const clearDatabase = async () => {
  await getConnection().dropDatabase();
  await getConnection().synchronize();
};

export const getHashPassword = async (password: string) => {
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  const result = salt + '.' + hash.toString('hex');
  return result;
};

export const createSuperUser = async (email: string, password: string) => {
  const repo = getConnection().getRepository(SuperUser);
  const superuser = await repo.save({
    email,
    password: await getHashPassword(password),
  });
  return superuser;
};

export const createPerson = async (name: string, age: number) => {
  const repo = getConnection().getRepository(Person);
  const person = await repo.save({ name, age });
  return person;
};
