import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationMetaDTO } from './pagination-meta.dto';

export class PaginatedResponseDTO<T> {
  @ApiProperty({
    title: 'data',
    description: 'List of items',
    isArray: true,
  })
  data: Array<T>;

  @ApiProperty({
    title: 'pagination',
    description: 'Pagination metadata',
    type: PaginationMetaDTO,
  })
  @Type(() => PaginationMetaDTO)
  pagination: PaginationMetaDTO;

  constructor(data: Array<T>, page: number, limit: number, total: number) {
    this.data = data;
    this.pagination = new PaginationMetaDTO(page, limit, total);
  }
}
