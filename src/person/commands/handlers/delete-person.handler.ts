import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SavePersonCommand } from '../impl/save-person.command';
import { Person } from 'src/entities/person';
import { DeletePersonCommand } from '../impl/delete-person.command';

@CommandHandler(DeletePersonCommand)
export class DeletePersonHandler
  implements ICommandHandler<DeletePersonCommand>
{
  constructor(@InjectRepository(Person) private repo: Repository<Person>) {}

  async execute(command: DeletePersonCommand) {
    const id = command.id;
    await this.repo.delete(id);
  }
}
