import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { SortOrder } from '@/common/enums';
import { ContentCategory, ContentSortBy } from '@/modules/contents/enums';

export class QueryContentsDTO {
  @ApiPropertyOptional({
    title: 'page',
    description: 'Page number',
    type: Number,
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    title: 'limit',
    description: 'Items per page',
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    title: 'search',
    description: 'Search by title, description or author',
    type: String,
    example: 'last of us',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  search?: string;

  @ApiPropertyOptional({
    title: 'category',
    description: 'Filter by content category',
    enum: ContentCategory,
    example: ContentCategory.GAME,
  })
  @IsOptional()
  @IsEnum(ContentCategory)
  category?: ContentCategory;

  @ApiPropertyOptional({
    title: 'createdBy',
    description: 'Filter by creator user ID',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    title: 'sortBy',
    description: 'Sort by field',
    enum: ContentSortBy,
    default: ContentSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ContentSortBy)
  sortBy?: ContentSortBy = ContentSortBy.CREATED_AT;

  @ApiPropertyOptional({
    title: 'order',
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
