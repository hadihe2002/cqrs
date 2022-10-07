import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperUser } from '../../../../entities/superuser';
import { CreateSuperUserCommnad } from '../impl/create-superuser.command';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@CommandHandler(CreateSuperUserCommnad)
export class CreateSuperUserHandler
  implements ICommandHandler<CreateSuperUserCommnad>
{
  constructor(
    @InjectRepository(SuperUser) private repo: Repository<SuperUser>,
  ) {}
  async execute(command: CreateSuperUserCommnad) {
    const { user: superuser } = command;
    const { email, password } = superuser;

    const userExist = await this.repo.findOne({ where: { email } });

    if (userExist) {
      throw new HttpException(
        'this email is alredy in use!',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      superuser.password = result;

      await this.repo.insert(superuser);
      return superuser;
    }
  }
}
