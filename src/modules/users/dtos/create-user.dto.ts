import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    title: 'username',
    description: 'Username (unique)',
    type: String,
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    title: 'email',
    description: 'User email address (unique)',
    type: String,
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    title: 'password',
    description:
      'User password (min 8 characters, must contain uppercase, lowercase, number and special character)',
    type: String,
    format: 'password',
    minLength: 8,
    example: 'Password@123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiPropertyOptional({
    title: 'fullName',
    description: 'User full name',
    type: String,
    example: 'John Doe',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  fullName?: string;
}
