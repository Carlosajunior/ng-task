import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ContentCategory } from '../entities/content.entity';

export class CreateContentDTO {
  @ApiProperty({
    title: 'title',
    description: 'Content title',
    type: String,
    example: 'The Last of Us',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    title: 'description',
    description: 'Content description',
    type: String,
    example: 'An action-adventure game...',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    title: 'category',
    description: 'Content category',
    enum: ContentCategory,
    example: ContentCategory.GAME,
  })
  @IsEnum(ContentCategory)
  @IsNotEmpty()
  category: ContentCategory;

  @ApiPropertyOptional({
    title: 'coverUrl',
    description: 'URL to cover image',
    type: String,
    example: 'https://example.com/cover.jpg',
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @ApiPropertyOptional({
    title: 'contentUrl',
    description: 'URL to content',
    type: String,
    example: 'https://example.com/content',
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  contentUrl?: string;

  @ApiPropertyOptional({
    title: 'author',
    description: 'Content author/creator',
    type: String,
    example: 'Naughty Dog',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string;
}

