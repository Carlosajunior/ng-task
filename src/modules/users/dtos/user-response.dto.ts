import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDTO {
  @ApiProperty({
    title: 'id',
    description: 'Unique user identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    title: 'username',
    description: 'Username (unique)',
    type: String,
    example: 'johndoe',
  })
  @Expose()
  username: string;

  @ApiProperty({
    title: 'email',
    description: 'User email address',
    type: String,
    format: 'email',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    title: 'fullName',
    description: 'User full name',
    type: String,
    example: 'John Doe',
    nullable: true,
  })
  @Expose()
  fullName?: string;

  @ApiProperty({
    title: 'ratingCount',
    description: 'Total number of ratings created by the user',
    type: Number,
    example: 10,
  })
  @Expose()
  ratingCount: number;

  @ApiPropertyOptional({
    title: 'lastLogin',
    description: 'Last login timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
    nullable: true,
  })
  @Expose()
  lastLogin?: Date;

  @ApiProperty({
    title: 'status',
    description: 'User account status',
    type: Boolean,
    example: true,
  })
  @Expose()
  status: boolean;

  @ApiProperty({
    title: 'createdAt',
    description: 'Account creation timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    title: 'updatedAt',
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
