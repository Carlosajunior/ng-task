import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../entities/content.entity';
import { ContentsController } from '../controllers';
import {
  CreateContentService,
  FindContentService,
  ListContentsService,
  UpdateContentService,
  DeleteContentService,
} from '../services';
import { ContentsRepository } from '../repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  controllers: [ContentsController],
  providers: [
    ContentsRepository,
    CreateContentService,
    FindContentService,
    ListContentsService,
    UpdateContentService,
    DeleteContentService,
  ],
  exports: [ContentsRepository],
})
export class ContentsModule {}

