import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '../entities';
import { Content } from '@/modules/contents/entities/content.entity';
import { RatingsController } from '../controllers';
import { RateContentService } from '../services';
import { RatingsRepository } from '../repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Content])],
  controllers: [RatingsController],
  providers: [RatingsRepository, RateContentService],
  exports: [RatingsRepository],
})
export class RatingsModule {}

