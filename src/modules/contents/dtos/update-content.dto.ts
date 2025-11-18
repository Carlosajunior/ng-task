import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ContentType } from '../entities/content.entity';

export class UpdateContentDTO {
  @ApiPropertyOptional({
    title: 'title',
    description: 'Content title',
    type: String,
    example: 'The Last of Us',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

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

  @ApiPropertyOptional({
    title: 'type',
    description: 'Type of content',
    enum: ContentType,
    example: ContentType.GAME,
  })
  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;

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

