import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDTO {
  @ApiProperty({
    title: 'page',
    description: 'Current page number',
    type: Number,
    example: 1,
  })
  page: number;

  @ApiProperty({
    title: 'limit',
    description: 'Items per page',
    type: Number,
    example: 10,
  })
  limit: number;

  @ApiProperty({
    title: 'total',
    description: 'Total number of items',
    type: Number,
    example: 100,
  })
  total: number;

  @ApiProperty({
    title: 'totalPages',
    description: 'Total number of pages',
    type: Number,
    example: 10,
  })
  totalPages: number;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }
}
