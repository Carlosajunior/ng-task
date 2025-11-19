import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  @ApiProperty({
    title: 'accessToken',
    description: 'JWT access token (short-lived)',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    title: 'refreshToken',
    description: 'JWT refresh token (long-lived)',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    title: 'tokenType',
    description: 'Type of token authentication',
    type: String,
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    title: 'expiresIn',
    description: 'Access token expiration time in seconds',
    type: Number,
    example: 900,
  })
  expiresIn: number;
}
