import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentsRepository } from '@/modules/contents/repositories';
import { ContentResponseDTO } from '@/modules/contents/dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindContentService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async execute(contentId: string): Promise<ContentResponseDTO> {
    const content = await this.contentsRepository.findById(contentId);

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    return plainToInstance(ContentResponseDTO, content);
  }
}
