import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RatingResponseDTO {
  @ApiProperty({
    title: 'userId',
    description: 'User ID who created the rating',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    title: 'contentId',
    description: 'Content ID that was rated',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Expose()
  contentId: string;

  @ApiProperty({
    title: 'rating',
    description: 'Rating value (1 to 5 stars)',
    type: Number,
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @Expose()
  rating: number;

  @ApiPropertyOptional({
    title: 'comment',
    description: 'Comment about the rating',
    type: String,
    example: 'Amazing game! Loved the story.',
    nullable: true,
  })
  @Expose()
  comment?: string;

  @ApiProperty({
    title: 'createdAt',
    description: 'Rating creation timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    title: 'updatedAt',
    description: 'Rating last update timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<RatingResponseDTO>) {
    Object.assign(this, partial);
  }
}
