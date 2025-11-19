import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '@/modules/ratings/entities';
import { Content } from '@/modules/contents/entities';
import { RatingsController } from '@/modules/ratings/controllers';
import { RateContentService } from '@/modules/ratings/services';
import { RatingsRepository } from '@/modules/ratings/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Content])],
  controllers: [RatingsController],
  providers: [RatingsRepository, RateContentService],
  exports: [RatingsRepository],
})
export class RatingsModule {}
