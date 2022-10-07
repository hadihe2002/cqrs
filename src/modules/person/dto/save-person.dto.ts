import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class SavePersonDto {
  @ApiProperty({ description: 'name of the person', example: 'Hadi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 19, description: 'age of the person' })
  @IsNumber()
  age: number;
}
