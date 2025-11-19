import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContentCategory } from '../enums/content-category.enum';

export class RatingSummary {
  @ApiProperty({ type: String, format: 'uuid' })
  userId: string;

  @ApiProperty({ type: Number, minimum: 1, maximum: 5 })
  rating: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  comment?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class ContentResponseDTO {
  @ApiProperty({
    title: 'id',
    description: 'Content unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    title: 'title',
    description: 'Content title',
    type: String,
    example: 'The Last of Us',
  })
  title: string;

  @ApiPropertyOptional({
    title: 'description',
    description: 'Content description',
    type: String,
    example: 'An action-adventure game...',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    title: 'category',
    description: 'Content category',
    enum: ContentCategory,
    example: ContentCategory.GAME,
  })
  category: ContentCategory;

  @ApiPropertyOptional({
    title: 'thumbnailUrl',
    description: 'URL to thumbnail image',
    type: String,
    example: 'https://example.com/cover.jpg',
    nullable: true,
  })
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    title: 'contentUrl',
    description: 'URL to content',
    type: String,
    example: 'https://example.com/content',
    nullable: true,
  })
  contentUrl?: string;

  @ApiPropertyOptional({
    title: 'author',
    description: 'Content author/creator',
    type: String,
    example: 'Naughty Dog',
    nullable: true,
  })
  author?: string;

  @ApiProperty({
    title: 'createdBy',
    description: 'User ID who created',
    type: String,
    format: 'uuid',
  })
  createdBy: string;

  @ApiProperty({
    title: 'ratings',
    description: 'Content ratings',
    type: [RatingSummary],
    isArray: true,
    example: [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 5,
        comment: 'Amazing!',
        createdAt: '2024-11-18T10:00:00.000Z',
      },
    ],
  })
  @Type(() => RatingSummary)
  ratings: RatingSummary[];

  @ApiProperty({
    title: 'status',
    description: 'Content status',
    type: Boolean,
    example: true,
  })
  status: boolean;

  @ApiProperty({
    title: 'createdAt',
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    title: 'updatedAt',
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
    example: '2024-11-18T10:00:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<ContentResponseDTO>) {
    Object.assign(this, partial);
  }
}
