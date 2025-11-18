import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ContentCategory } from '../entities/content.entity';

@Exclude()
export class ContentResponseDTO {
  @ApiProperty({
    title: 'id',
    description: 'Content unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    title: 'title',
    description: 'Content title',
    type: String,
    example: 'The Last of Us',
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({
    title: 'description',
    description: 'Content description',
    type: String,
    example: 'An action-adventure game...',
    nullable: true,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    title: 'category',
    description: 'Content category',
    enum: ContentCategory,
    example: ContentCategory.GAME,
  })
  @Expose()
  category: ContentCategory;

  @ApiPropertyOptional({
    title: 'coverUrl',
    description: 'URL to cover image',
    type: String,
    example: 'https://example.com/cover.jpg',
    nullable: true,
  })
  @Expose()
  coverUrl?: string;

  @ApiPropertyOptional({
    title: 'contentUrl',
    description: 'URL to content',
    type: String,
    example: 'https://example.com/content',
    nullable: true,
  })
  @Expose()
  contentUrl?: string;

  @ApiPropertyOptional({
    title: 'author',
    description: 'Content author/creator',
    type: String,
    example: 'Naughty Dog',
    nullable: true,
  })
  @Expose()
  author?: string;

  @ApiProperty({
    title: 'ratingCount',
    description: 'Number of ratings',
    type: Number,
    example: 150,
  })
  @Expose()
  ratingCount: number;

  @ApiProperty({
    title: 'averageRating',
    description: 'Average rating',
    type: Number,
    example: 4.5,
  })
  @Expose()
  averageRating: number;

  @ApiProperty({
    title: 'createdBy',
    description: 'User ID who created',
    type: String,
    format: 'uuid',
  })
  @Expose()
  createdBy: string;

  @ApiProperty({
    title: 'status',
    description: 'Content status',
    type: Boolean,
    example: true,
  })
  @Expose()
  status: boolean;

  @ApiProperty({
    title: 'createdAt',
    description: 'Creation timestamp',
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

  constructor(partial: Partial<ContentResponseDTO>) {
    Object.assign(this, partial);
  }
}

