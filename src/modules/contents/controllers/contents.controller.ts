import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  CreateContentService,
  FindContentService,
  ListContentsService,
  UpdateContentService,
  DeleteContentService,
} from '@/modules/contents/services';
import {
  CreateContentDTO,
  UpdateContentDTO,
  ContentResponseDTO,
  QueryContentsDTO,
  PaginatedContentsDTO,
} from '@/modules/contents/dtos';
import { Public, CurrentUser } from '@/common/decorators';

@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(
    private readonly createContentService: CreateContentService,
    private readonly findContentService: FindContentService,
    private readonly listContentsService: ListContentsService,
    private readonly updateContentService: UpdateContentService,
    private readonly deleteContentService: DeleteContentService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new content' })
  @ApiResponse({
    status: 201,
    description: 'Content created successfully',
    type: ContentResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createContentDto: CreateContentDTO,
    @CurrentUser() user: { id: string; email: string },
  ): Promise<ContentResponseDTO> {
    return this.createContentService.execute(createContentDto, user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all contents with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Contents retrieved successfully',
    type: PaginatedContentsDTO,
  })
  async findAll(
    @Query() queryDto: QueryContentsDTO,
  ): Promise<PaginatedContentsDTO> {
    return this.listContentsService.execute(queryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiParam({
    name: 'id',
    description: 'Content UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Content found',
    type: ContentResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ContentResponseDTO> {
    return this.findContentService.execute(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content by ID (partial)' })
  @ApiParam({
    name: 'id',
    description: 'Content UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Content updated successfully',
    type: ContentResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContentDto: UpdateContentDTO,
    @CurrentUser() user: { id: string; email: string },
  ): Promise<ContentResponseDTO> {
    return this.updateContentService.execute(id, updateContentDto, user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content by ID' })
  @ApiParam({
    name: 'id',
    description: 'Content UUID',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({ status: 204, description: 'Content deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string },
  ): Promise<void> {
    return this.deleteContentService.execute(id, user.id);
  }
}
