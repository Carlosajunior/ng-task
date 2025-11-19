import { Injectable } from '@nestjs/common';
import { ContentsRepository } from '@/modules/contents/repositories';
import { CreateContentDTO, ContentResponseDTO } from '@/modules/contents/dtos';
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

    return plainToInstance(ContentResponseDTO, content);
  }
}
