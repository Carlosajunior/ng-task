import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentsRepository } from '@/modules/contents/repositories/contents.repository';
import { Content } from '@/modules/contents/entities';
import { QueryContentsDTO } from '@/modules/contents/dtos';
import { ContentCategory } from '@/modules/contents/enums';
import { SortOrder } from '@/common/enums';

describe('ContentsRepository', () => {
  let repository: ContentsRepository;
  let mockRepository: jest.Mocked<Repository<Content>>;

  const mockContent: Content = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Content',
    description: 'Test Description',
    category: ContentCategory.GAME,
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    contentUrl: 'https://example.com/content',
    author: 'Test Author',
    createdBy: 'user-id',
    status: true,
    ratings: [],
    creator: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentsRepository,
        {
          provide: getRepositoryToken(Content),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<ContentsRepository>(ContentsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save content', async () => {
      const contentData = { title: 'Test', category: ContentCategory.GAME };
      mockRepository.create.mockReturnValue(mockContent as any);
      mockRepository.save.mockResolvedValue(mockContent);

      const result = await repository.create(contentData);

      expect(mockRepository.create).toHaveBeenCalledWith(contentData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockContent);
      expect(result).toEqual(mockContent);
    });
  });

  describe('findById', () => {
    it('should find content by id with ratings', async () => {
      mockRepository.findOne.mockResolvedValue(mockContent);

      const result = await repository.findById(mockContent.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockContent.id },
        relations: ['ratings'],
      });
      expect(result).toEqual(mockContent);
    });

    it('should return null when content not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    const queryDto: QueryContentsDTO = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt' as any,
      order: SortOrder.DESC,
    };

    it('should find all contents with pagination', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        [mockContent],
        1,
      ]);

      const result = await repository.findAll(queryDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('content');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'content.ratings',
        'ratings',
      );
      expect(result).toEqual([[mockContent], 1]);
    });

    it('should filter by category when provided', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      const queryWithCategory = {
        ...queryDto,
        category: ContentCategory.GAME,
      };

      (queryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        [mockContent],
        1,
      ]);

      await repository.findAll(queryWithCategory);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'content.category = :category',
        { category: ContentCategory.GAME },
      );
    });

    it('should filter by createdBy when provided', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      const queryWithCreatedBy = { ...queryDto, createdBy: 'user-id' };

      (queryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        [mockContent],
        1,
      ]);

      await repository.findAll(queryWithCreatedBy);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'content.createdBy = :createdBy',
        { createdBy: 'user-id' },
      );
    });

    it('should filter by search when provided', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      const queryWithSearch = { ...queryDto, search: 'test' };

      (queryBuilder.getManyAndCount as jest.Mock).mockResolvedValue([
        [mockContent],
        1,
      ]);

      await repository.findAll(queryWithSearch);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(content.title ILIKE :search OR content.description ILIKE :search OR content.author ILIKE :search)',
        { search: '%test%' },
      );
    });
  });

  describe('update', () => {
    it('should update content and return updated content', async () => {
      const updateData = { title: 'Updated Title' };
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue({
        ...mockContent,
        ...updateData,
      });

      const result = await repository.update(mockContent.id, updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(
        mockContent.id,
        updateData,
      );
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('should delete content', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await repository.delete(mockContent.id);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockContent.id);
    });
  });

  describe('exists', () => {
    it('should return true when content exists', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await repository.exists(mockContent.id);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { id: mockContent.id },
      });
      expect(result).toBe(true);
    });

    it('should return false when content does not exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await repository.exists('non-existent-id');

      expect(result).toBe(false);
    });
  });
});

