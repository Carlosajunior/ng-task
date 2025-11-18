import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    title: 'email',
    description: 'User email address',
    type: String,
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    title: 'password',
    description: 'User password',
    type: String,
    format: 'password',
    example: 'Password@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

