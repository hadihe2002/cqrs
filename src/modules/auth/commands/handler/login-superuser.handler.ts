import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperUser } from '../../../../entities/superuser';
import { CreateSuperUserCommnad } from '../impl/create-superuser.command';
import { LoginSuperUserCommnad } from '../impl/login-superuser.commnad';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { HttpException, HttpStatus } from '@nestjs/common';

const scrypt = promisify(_scrypt);

@CommandHandler(LoginSuperUserCommnad)
export class LoginSuperUserHandler
  implements ICommandHandler<LoginSuperUserCommnad>
{
  constructor(
    @InjectRepository(SuperUser) private repo: Repository<SuperUser>,
  ) {}
  async execute(command: LoginSuperUserCommnad) {
    const { user: superuser } = command;
    const { email, password } = superuser;

    const user = await this.repo.findOne({ where: { email } });

    if (user) {
      const [salt, hashed] = user.password.split('.');
      const hash = ((await scrypt(password, salt, 32)) as Buffer).toString(
        'hex',
      );

      if (user && hashed === hash) {
        return user;
      } else {
        throw new HttpException(
          'email or password was incorrect!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    throw new HttpException(
      'email or password was incorrect!',
      HttpStatus.BAD_REQUEST,
    );
  }
}
