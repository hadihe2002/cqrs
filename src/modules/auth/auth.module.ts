import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperUser } from '../../entities/superuser';
import { AuthController } from './auth.controller';
import { CreateSuperUserHandler } from './commands/handler/create-superuser.handler';
import { LoginSuperUserHandler } from './commands/handler/login-superuser.handler';

@Module({
  imports: [TypeOrmModule.forFeature([SuperUser]), CqrsModule],
  controllers: [AuthController],
  providers: [CreateSuperUserHandler, LoginSuperUserHandler],
})
export class AuthModule {}
