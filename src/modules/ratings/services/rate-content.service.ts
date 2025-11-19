import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RatingsRepository } from '../repositories/ratings.repository';
import { Content } from '@/modules/contents/entities/content.entity';
import { CreateRatingDTO } from '../dtos/create-rating.dto';
import { RatingResponseDTO } from '../dtos/rating-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RateContentService {
  constructor(
    private readonly ratingsRepository: RatingsRepository,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    contentId: string,
    userId: string,
    dto: CreateRatingDTO,
  ): Promise<RatingResponseDTO> {
    // Verificar se o conteúdo existe
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return await this.dataSource.transaction(async (manager) => {
      const ratingsRepo = manager.withRepository(this.ratingsRepository);
      const contentsRepo = manager.getRepository(Content);

      // Buscar rating existente
      let rating = await ratingsRepo.findByUserAndContent(userId, contentId);

      if (rating) {
        // Atualizar rating existente
        rating.rating = dto.rating;
        rating.comment = dto.comment;
      } else {
        // Criar novo rating
        rating = ratingsRepo.create({
          userId,
          contentId,
          rating: dto.rating,
          comment: dto.comment,
        });
      }

      await ratingsRepo.save(rating);

      // Recalcular média e contagem
      const { average, count } = await ratingsRepo.calculateAverageRating(
        contentId,
      );

      // Atualizar conteúdo
      await contentsRepo.update(contentId, {
        averageRating: parseFloat(average.toFixed(2)),
        ratingCount: count,
      });

      return plainToInstance(RatingResponseDTO, rating, {
        excludeExtraneousValues: true,
      });
    });
  }
}

