import { IsString, IsNumber } from 'class-validator';
export class SavePersonDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
}
