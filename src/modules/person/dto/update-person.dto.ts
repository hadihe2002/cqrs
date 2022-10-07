import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePersonDto {
  @ApiProperty({ description: 'name of the person', example: 'Hadi' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'name of the person', example: 19 })
  @IsNumber()
  @IsOptional()
  age: number;
}
