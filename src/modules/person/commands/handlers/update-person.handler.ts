import { Repository, UpdateDateColumn } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePersonCommnad } from '../impl/update-person.command';
import { Person } from '../../../../entities/person';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(UpdatePersonCommnad)
export class UpdatePersonHandler
  implements ICommandHandler<UpdatePersonCommnad>
{
  constructor(@InjectRepository(Person) private repo: Repository<Person>) {}

  async execute(command: UpdatePersonCommnad) {
    const { id, attrs } = command;
    const person = await this.repo.findOne(id);
    if (person) {
      Object.assign(person, attrs);
      return await this.repo.save(person);
    } else {
      throw new HttpException(
        "Person with this id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
