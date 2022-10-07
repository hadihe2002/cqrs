import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../../entities/person';
import { PersonController } from './person.controller';
import { GetPersonsHandler } from './queries/handlers/get-person.handler';
import { SavePersonHandler } from './commands/handlers/save-person.handler';
import { DeletePersonHandler } from './commands/handlers/delete-person.handler';
import { UpdatePersonHandler } from './commands/handlers/update-person.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), CqrsModule],
  controllers: [PersonController],
  providers: [
    GetPersonsHandler,
    SavePersonHandler,
    DeletePersonHandler,
    UpdatePersonHandler,
  ],
})
export class PersonModule {}
