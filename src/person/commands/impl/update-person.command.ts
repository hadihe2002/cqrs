import { UpdatePersonDto } from 'src/person/dto/update-person.dto';

export class UpdatePersonCommnad {
  constructor(
    public readonly id: number,
    public readonly attrs: UpdatePersonDto,
  ) {}
}
