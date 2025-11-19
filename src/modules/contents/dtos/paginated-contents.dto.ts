import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDTO } from '@/common/dtos';
import { ContentResponseDTO } from './content-response.dto';

export class PaginatedContentsDTO extends PaginatedResponseDTO<ContentResponseDTO> {
  @ApiProperty({
    title: 'data',
    description: 'List of contents',
    isArray: true,
    type: ContentResponseDTO,
  })
  data: ContentResponseDTO[];
}
