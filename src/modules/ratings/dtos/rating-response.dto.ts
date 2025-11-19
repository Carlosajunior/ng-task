import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RatingResponseDTO {
  @ApiProperty({
    description: 'User ID who created the rating',
    type: String,
    format: 'uuid',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Content ID that was rated',
    type: String,
    format: 'uuid',
  })
  @Expose()
  contentId: string;

  @ApiProperty({
    description: 'Rating value (1 to 5)',
    type: Number,
    example: 5,
  })
  @Expose()
  rating: number;

  @ApiPropertyOptional({
    description: 'Comment about the rating',
    type: String,
    example: 'Amazing game!',
    nullable: true,
  })
  @Expose()
  comment?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
  })
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<RatingResponseDTO>) {
    Object.assign(this, partial);
  }
}

