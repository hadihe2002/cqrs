import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPersonQuery } from './queries/impl/get-person';
import { SavePersonCommand } from './commands/impl/save-person.command';
import { DeletePersonCommand } from './commands/impl/delete-person.command';
import { SavePersonDto } from './dto/save-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { UpdatePersonCommnad } from './commands/impl/update-person.command';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGaurd } from '../../gaurds/auth.guard';

@ApiTags('person')
@ApiCookieAuth()
@Controller('person')
export class PersonController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/all')
  @UseGuards(AuthGaurd)
  @ApiOperation({ description: 'get all persons entity' })
  @ApiResponse({ status: 200 })
  async getAll() {
    return await this.queryBus.execute(new GetPersonQuery());
  }

  @Post('/save')
  @ApiOperation({ description: 'add a new person to entity' })
  @ApiResponse({ status: 201 })
  async savePerson(@Body() person: SavePersonDto) {
    return await this.commandBus.execute(new SavePersonCommand(person));
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGaurd)
  @ApiOperation({ description: 'delete a person entity' })
  @ApiResponse({ status: 202 })
  async deletePerson(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return await this.commandBus.execute(new DeletePersonCommand(id));
  }

  @Patch('/update/:id')
  @UseGuards(AuthGaurd)
  @ApiOperation({ description: 'update an person with uuid' })
  @ApiResponse({ status: 200 })
  async updatePerson(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdatePersonDto,
  ) {
    return await this.commandBus.execute(new UpdatePersonCommnad(id, body));
  }
}
