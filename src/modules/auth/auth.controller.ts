import {
  Controller,
  Post,
  Body,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SerializeInterceptor } from '../../interceptor/serilaize.interceptor';
import { PersonDto } from '../../modules/person/dto/person.dto';
import { CreateSuperUserCommnad } from './commands/impl/create-superuser.command';
import { LoginSuperUserCommnad } from './commands/impl/login-superuser.commnad';
import { SuperUserDto } from './dto/superuser.dto';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(new SerializeInterceptor(PersonDto))
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/signup')
  @ApiOperation({ description: 'signup superuser' })
  signup(@Body() user: SuperUserDto) {
    return this.commandBus.execute(new CreateSuperUserCommnad(user));
  }

  @Post('/signin')
  @ApiOperation({ description: 'signin superuser' })
  async signin(@Body() user: SuperUserDto, @Session() session: any) {
    const inf = await this.commandBus.execute(new LoginSuperUserCommnad(user));
    session.userId = inf.id;
    return inf;
  }

  @Post('/signout')
  @ApiOperation({ description: 'signout superuser' })
  async signout(@Session() session: any) {
    session.userId = null;
  }
}
