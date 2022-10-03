import { Repository, UpdateDateColumn } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePersonCommnad } from '../impl/update-person.command';
import { Person } from 'src/entities/person';

@CommandHandler(UpdatePersonCommnad)
export class UpdatePersonHandler
  implements ICommandHandler<UpdatePersonCommnad>
{
  constructor(@InjectRepository(Person) private repo: Repository<Person>) {}

  async execute(command: UpdatePersonCommnad) {
    const { id, attrs } = command;
    const person = await this.repo.findOne(id);
    Object.assign(person, attrs);
    await this.repo.save(person);
  }
}
