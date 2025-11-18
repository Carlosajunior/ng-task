import { ApiProperty } from '@nestjs/swagger';
import { ContentResponseDTO } from './content-response.dto';

export class PaginatedContentsDTO {
  @ApiProperty({
    title: 'data',
    description: 'List of contents',
    type: [ContentResponseDTO],
  })
  data: ContentResponseDTO[];

  @ApiProperty({
    title: 'meta',
    description: 'Pagination metadata',
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    data: ContentResponseDTO[],
    page: number,
    limit: number,
    total: number,
  ) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

