import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Content } from '@/modules/contents/entities/content.entity';
import { User } from '@/modules/users/entities/user.entity';
import { CreateRatingDTO } from '../dtos/create-rating.dto';
import { RatingResponseDTO } from '../dtos/rating-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RateContentService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    contentId: string,
    userId: string,
    dto: CreateRatingDTO,
  ): Promise<RatingResponseDTO> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return await this.dataSource.transaction(async (manager) => {
      const ratingsRepo = manager.getRepository(Rating);
      const usersRepo = manager.getRepository(User);

      const existingRating = await ratingsRepo.findOne({
        where: { userId, contentId },
      });

      if (existingRating) {
        throw new ConflictException(
          'You have already rated this content. Each user can only rate a content once.',
        );
      }

      const rating = ratingsRepo.create({
        userId,
        contentId,
        rating: dto.rating,
        comment: dto.comment,
      });

      await ratingsRepo.save(rating);

      await usersRepo.increment({ id: userId }, 'ratingCount', 1);

      return plainToInstance(RatingResponseDTO, rating, {
        excludeExtraneousValues: true,
      });
    });
  }
}
