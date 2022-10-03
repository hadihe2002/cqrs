import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePersonDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;
}
