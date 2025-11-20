import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RateContentService } from '@/modules/ratings/services/rate-content.service';
import { Rating } from '@/modules/ratings/entities';
import { Content } from '@/modules/contents/entities';
import { User } from '@/modules/users/entities';

describe('RateContentService', () => {
  let service: RateContentService;
  let ratingRepository: jest.Mocked<Repository<Rating>>;
  let contentRepository: jest.Mocked<Repository<Content>>;
  let dataSource: jest.Mocked<DataSource>;

  const mockRatingsRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersRepo = {
    increment: jest.fn(),
  };

  const mockManager = {
    getRepository: jest.fn((entity) => {
      if (entity === Rating) return mockRatingsRepo;
      if (entity === User) return mockUsersRepo;
      return {};
    }),
  };

  const mockRatingRepository = {
    findOne: jest.fn(),
  };

  const mockContentRepository = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn((callback) => callback(mockManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateContentService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingRepository,
        },
        {
          provide: getRepositoryToken(Content),
          useValue: mockContentRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<RateContentService>(RateContentService);
    ratingRepository = module.get(getRepositoryToken(Rating));
    contentRepository = module.get(getRepositoryToken(Content));
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new rating successfully', async () => {
      const contentId = 'content-123';
      const userId = 'user-123';
      const createDto = {
        rating: 5,
        comment: 'Excellent!',
      };

      const content = {
        id: contentId,
        title: 'Test Game',
      };

      const createdRating = {
        id: 'rating-123',
        userId,
        contentId,
        rating: createDto.rating,
        comment: createDto.comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockContentRepository.findOne.mockResolvedValue(content as any);
      mockRatingsRepo.findOne.mockResolvedValue(null);
      mockRatingsRepo.create.mockReturnValue(createdRating as any);
      mockRatingsRepo.save.mockResolvedValue(createdRating as any);
      mockUsersRepo.increment.mockResolvedValue(undefined);

      const result = await service.execute(contentId, userId, createDto);

      expect(mockContentRepository.findOne).toHaveBeenCalledWith({
        where: { id: contentId },
      });
      expect(mockRatingsRepo.findOne).toHaveBeenCalledWith({
        where: { userId, contentId },
      });
      expect(mockRatingsRepo.create).toHaveBeenCalledWith({
        userId,
        contentId,
        rating: createDto.rating,
        comment: createDto.comment,
      });
      expect(mockRatingsRepo.save).toHaveBeenCalledWith(createdRating);
      expect(mockUsersRepo.increment).toHaveBeenCalledWith(
        { id: userId },
        'ratingCount',
        1,
      );
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when content not found', async () => {
      const contentId = 'non-existent-id';
      const userId = 'user-123';
      const createDto = {
        rating: 5,
        comment: 'Excellent!',
      };

      mockContentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.execute(contentId, userId, createDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.execute(contentId, userId, createDto),
      ).rejects.toThrow('Content not found');
    });

    it('should throw ConflictException when user already rated the content', async () => {
      const contentId = 'content-123';
      const userId = 'user-123';
      const createDto = {
        rating: 5,
        comment: 'Excellent!',
      };

      const content = {
        id: contentId,
        title: 'Test Game',
      };

      const existingRating = {
        id: 'rating-123',
        userId,
        contentId,
        rating: 4,
        comment: 'Good',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockContentRepository.findOne.mockResolvedValue(content as any);
      mockRatingsRepo.findOne.mockResolvedValue(existingRating as any);

      await expect(
        service.execute(contentId, userId, createDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.execute(contentId, userId, createDto),
      ).rejects.toThrow(
        'You have already rated this content. Each user can only rate a content once.',
      );
    });
  });
});
