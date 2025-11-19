import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ContentsRepository } from '@/modules/contents/repositories';

@Injectable()
export class DeleteContentService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  async execute(contentId: string, userId: string): Promise<void> {
    const content = await this.contentsRepository.findById(contentId);

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    if (content.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only delete contents created by you',
      );
    }

    await this.contentsRepository.delete(contentId);
  }
}
