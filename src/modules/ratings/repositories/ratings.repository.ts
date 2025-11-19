import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingsRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly repository: Repository<Rating>,
  ) {}

  async findByUserAndContent(
    userId: string,
    contentId: string,
  ): Promise<Rating | null> {
    return await this.repository.findOne({
      where: { userId, contentId },
    });
  }

  async create(data: Partial<Rating>): Promise<Rating> {
    const rating = await this.repository.create(data);
    return await this.repository.save(rating);
  }

  async save(rating: Rating): Promise<Rating> {
    return await this.repository.save(rating);
  }

  async calculateAverageRating(contentId: string): Promise<{
    average: number;
    count: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .addSelect('COUNT(rating.rating)', 'count')
      .where('rating.contentId = :contentId', { contentId })
      .getRawOne();

    return {
      average: parseFloat(result.average) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({ where: { userId } });
  }
}
