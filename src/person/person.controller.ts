import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPersonQuery } from './queries/impl/get-person';
import { SavePersonCommand } from './commands/impl/save-person.command';
import { DeletePersonCommand } from './commands/impl/delete-person.command';
import { SavePersonDto } from './dto/save-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { resourceUsage } from 'process';
import { UpdatePersonCommnad } from './commands/impl/update-person.command';

@Controller('person')
export class PersonController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/all')
  async getAll() {
    return await this.queryBus.execute(new GetPersonQuery());
  }

  @Post('/save')
  async savePerson(@Body() person: SavePersonDto) {
    return await this.commandBus.execute(new SavePersonCommand(person));
  }

  @Delete('/delete/:id')
  async deletePerson(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeletePersonCommand(id));
  }

  @Patch('/update/:id')
  async updatePerson(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePersonDto,
  ) {
    return await this.commandBus.execute(new UpdatePersonCommnad(id, body));
  }
}
