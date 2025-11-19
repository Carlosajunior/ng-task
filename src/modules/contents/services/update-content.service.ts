import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ContentsRepository } from '@/modules/contents/repositories';
import { UpdateContentDTO, ContentResponseDTO } from '@/modules/contents/dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateContentService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async execute(
    contentId: string,
    dto: UpdateContentDTO,
    userId: string,
  ): Promise<ContentResponseDTO> {
    const content = await this.contentsRepository.findById(contentId);

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    if (content.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only update contents created by you',
      );
    }

    const updatedContent = await this.contentsRepository.update(contentId, dto);

    return plainToInstance(ContentResponseDTO, updatedContent, {
      excludeExtraneousValues: true,
    });
  }
}
