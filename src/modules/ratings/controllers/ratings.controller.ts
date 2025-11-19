import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RateContentService } from '../services';
import { CreateRatingDTO, RatingResponseDTO } from '../dtos';
import { CurrentUser } from '@/common/decorators';

@ApiTags('Ratings')
@Controller('contents/:contentId/ratings')
export class RatingsController {
  constructor(private readonly rateContentService: RateContentService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate a content (1 to 5 stars)' })
  @ApiParam({
    name: 'contentId',
    description: 'Content UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Rating created/updated successfully',
    type: RatingResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async rateContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Body() createRatingDto: CreateRatingDTO,
    @CurrentUser() user: { id: string; email: string },
  ): Promise<RatingResponseDTO> {
    return this.rateContentService.execute(contentId, user.id, createRatingDto);
  }
}

