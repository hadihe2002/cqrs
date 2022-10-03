import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SavePersonCommand } from '../impl/save-person.command';
import { Person } from 'src/entities/person';

@CommandHandler(SavePersonCommand)
export class SavePersonHandler implements ICommandHandler<SavePersonCommand> {
  constructor(@InjectRepository(Person) private repo: Repository<Person>) {}

  async execute(command: SavePersonCommand) {
    const { person } = command;
    await this.repo.insert(person);
  }
}
