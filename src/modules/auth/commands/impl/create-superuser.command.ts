import { SuperUserDto } from '../../dto/superuser.dto';
export class CreateSuperUserCommnad {
  constructor(public readonly user: SuperUserDto) {}
}
