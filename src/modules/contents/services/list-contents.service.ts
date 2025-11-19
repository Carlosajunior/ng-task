import { Injectable } from '@nestjs/common';
import { ContentsRepository } from '../repositories';
import {
  QueryContentsDTO,
  PaginatedContentsDTO,
  ContentResponseDTO,
} from '../dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ListContentsService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async execute(queryDto: QueryContentsDTO): Promise<PaginatedContentsDTO> {
    const [contents, total] =
      await this.contentsRepository.findAll(queryDto);

    const contentDtos = contents.map((content) =>
      plainToInstance(ContentResponseDTO, content),
    );

    return new PaginatedContentsDTO(
      contentDtos,
      queryDto.page,
      queryDto.limit,
      total,
    );
  }
}

