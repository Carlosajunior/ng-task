import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '@/modules/contents/entities';
import { ContentsController } from '@/modules/contents/controllers';
import {
  CreateContentService,
  FindContentService,
  ListContentsService,
  UpdateContentService,
  DeleteContentService,
} from '@/modules/contents/services';
import { ContentsRepository } from '@/modules/contents/repositories';

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

