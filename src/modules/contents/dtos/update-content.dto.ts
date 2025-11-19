import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ContentCategory } from '@/modules/contents/enums';

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
    title: 'category',
    description: 'Content category',
    enum: ContentCategory,
    example: ContentCategory.GAME,
  })
  @IsEnum(ContentCategory)
  @IsOptional()
  category?: ContentCategory;

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
