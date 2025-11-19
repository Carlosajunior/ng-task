import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../entities/content.entity';
import { QueryContentsDTO } from '../dtos';

@Injectable()
export class ContentsRepository {
  constructor(
    @InjectRepository(Content)
    private readonly repository: Repository<Content>,
  ) {}

  async create(contentData: Partial<Content>): Promise<Content> {
    const content = await this.repository.create(contentData);
    return await this.repository.save(content);
  }

  async findById(contentId: string): Promise<Content | null> {
    return await this.repository.findOne({
      where: { id: contentId },
      relations: ['ratings'],
    });
  }

  async findAll(queryDto: QueryContentsDTO): Promise<[Content[], number]> {
    const { page, limit, search, category, createdBy, sortBy, order } =
      queryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = await this.repository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.ratings', 'ratings');

    if (category) {
      queryBuilder.andWhere('content.category = :category', { category });
    }

    if (createdBy) {
      queryBuilder.andWhere('content.createdBy = :createdBy', { createdBy });
    }

    if (search) {
      queryBuilder.andWhere(
        '(content.title ILIKE :search OR content.description ILIKE :search OR content.author ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.andWhere('content.status = :status', { status: true });

    queryBuilder.orderBy(`content.${sortBy}`, order).skip(skip).take(limit);

    return await queryBuilder.getManyAndCount();
  }

  async update(contentId: string, data: Partial<Content>): Promise<Content> {
    await this.repository.update(contentId, data);
    return await this.findById(contentId);
  }

  async delete(contentId: string): Promise<void> {
    await this.repository.delete(contentId);
  }

  async exists(contentId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id: contentId } });
    return count > 0;
  }
}
