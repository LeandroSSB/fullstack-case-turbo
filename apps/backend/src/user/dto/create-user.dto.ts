import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'some@mail.com' })
  email: string;

  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'some@mail.com' })
  email?: string;
}
