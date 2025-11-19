import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, Max, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRatingDTO {
  @ApiProperty({
    description: 'Rating value (1 to 5 stars)',
    type: Number,
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional comment about the rating',
    type: String,
    example: 'Amazing game! Loved the story.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment?: string;
}

