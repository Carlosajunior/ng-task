import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingsRepository extends Repository<Rating> {
  constructor(private dataSource: DataSource) {
    super(Rating, dataSource.createEntityManager());
  }

  async findByUserAndContent(
    userId: string,
    contentId: string,
  ): Promise<Rating | null> {
    return this.findOne({
      where: { userId, contentId },
    });
  }

  async calculateAverageRating(contentId: string): Promise<{
    average: number;
    count: number;
  }> {
    const result = await this.createQueryBuilder('rating')
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
    return this.count({ where: { userId } });
  }
}

