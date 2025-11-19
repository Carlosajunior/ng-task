import { Injectable, BadRequestException } from '@nestjs/common';
import { ContentsRepository } from '../repositories';
import { CreateContentDTO, ContentResponseDTO } from '../dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateContentService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async execute(
    dto: CreateContentDTO,
    userId: string,
  ): Promise<ContentResponseDTO> {
    const content = await this.contentsRepository.create({
      ...dto,
      createdBy: userId,
      status: true,
    });

    return plainToInstance(ContentResponseDTO, content, {
      excludeExtraneousValues: true,
    });
  }
}

