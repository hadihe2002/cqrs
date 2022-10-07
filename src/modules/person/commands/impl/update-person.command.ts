import { UpdatePersonDto } from 'src/modules/person/dto/update-person.dto';

export class UpdatePersonCommnad {
  constructor(
    public readonly id: string,
    public readonly attrs: UpdatePersonDto,
  ) {}
}
