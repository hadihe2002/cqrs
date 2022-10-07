import { SuperUserDto } from 'src/modules/auth/dto/superuser.dto';
export class LoginSuperUserCommnad {
  constructor(public readonly user: SuperUserDto) {}
}
