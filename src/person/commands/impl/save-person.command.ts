import { SavePersonDto } from '../../dto/save-person.dto';
export class SavePersonCommand {
  constructor(public readonly person: SavePersonDto) {}
}
