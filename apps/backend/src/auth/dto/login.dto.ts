import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'some@mail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  password: string;
}
