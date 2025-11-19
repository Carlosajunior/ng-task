import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    title: 'login',
    description: 'User email or username',
    type: String,
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

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

