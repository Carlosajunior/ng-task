import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty({
    title: 'id',
    description: 'Unique user identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    title: 'email',
    description: 'User email address',
    type: String,
    format: 'email',
    example: 'john.doe@example.com',
  })
  email: string;
}

export class AuthResponseDTO {
  @ApiProperty({
    title: 'access_token',
    description: 'JWT access token (short-lived)',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    title: 'refresh_token',
    description: 'JWT refresh token (long-lived)',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    title: 'token_type',
    description: 'Type of token authentication',
    type: String,
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    title: 'expires_in',
    description: 'Access token expiration time in seconds',
    type: Number,
    example: 900,
  })
  expires_in: number;

  @ApiProperty({
    title: 'user',
    description: 'Authenticated user information',
    type: UserInfo,
  })
  user: UserInfo;
}

