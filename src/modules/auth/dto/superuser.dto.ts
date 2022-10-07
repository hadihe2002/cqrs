import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
export class SuperUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'email of superuser',
    example: 'example@example.com',
  })
  email: string;
  @ApiProperty({
    description: 'password of the superuser',
    example: 'P@ssw0rd',
  })
  @IsString()
  password: string;
}
