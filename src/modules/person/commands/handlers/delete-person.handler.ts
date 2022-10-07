import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Person } from '../../../../entities/person';
import { DeletePersonCommand } from '../impl/delete-person.command';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(DeletePersonCommand)
export class DeletePersonHandler
  implements ICommandHandler<DeletePersonCommand>
{
  constructor(@InjectRepository(Person) private repo: Repository<Person>) {}

  async execute(command: DeletePersonCommand) {
    const id = command.id;
    const person = await this.repo.findOne(id);
    if (person) {
      await this.repo.delete(id);
      return { message: 'Person was deleted successfully!' };
    } else {
      throw new HttpException(
        "Person with this id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
