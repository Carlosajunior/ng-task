import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RatingsRepository } from '@/modules/ratings/repositories/ratings.repository';
import { Rating } from '@/modules/ratings/entities';

describe('RatingsRepository', () => {
  let repository: RatingsRepository;
  let typeormRepository: jest.Mocked<Repository<Rating>>;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockTypeormRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsRepository,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    repository = module.get<RatingsRepository>(RatingsRepository);
    typeormRepository = module.get(getRepositoryToken(Rating));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserAndContent', () => {
    it('should find a rating by user and content', async () => {
      const userId = 'user-123';
      const contentId = 'content-123';
      const rating = {
        id: 'rating-123',
        userId,
        contentId,
        rating: 5,
        comment: 'Great!',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepository.findOne.mockResolvedValue(rating as any);

      const result = await repository.findByUserAndContent(userId, contentId);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { userId, contentId },
      });
      expect(result).toEqual(rating);
    });

    it('should return null when rating not found', async () => {
      const userId = 'user-123';
      const contentId = 'content-123';

      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByUserAndContent(userId, contentId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new rating', async () => {
      const ratingData = {
        userId: 'user-123',
        contentId: 'content-123',
        rating: 5,
        comment: 'Excellent!',
      };

      const createdRating = {
        id: 'rating-123',
        ...ratingData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepository.create.mockReturnValue(createdRating as any);
      typeormRepository.save.mockResolvedValue(createdRating as any);

      const result = await repository.create(ratingData);

      expect(typeormRepository.create).toHaveBeenCalledWith(ratingData);
      expect(typeormRepository.save).toHaveBeenCalledWith(createdRating);
      expect(result).toEqual(createdRating);
    });
  });

  describe('save', () => {
    it('should save a rating', async () => {
      const rating = {
        id: 'rating-123',
        userId: 'user-123',
        contentId: 'content-123',
        rating: 4,
        comment: 'Good',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepository.save.mockResolvedValue(rating as any);

      const result = await repository.save(rating as any);

      expect(typeormRepository.save).toHaveBeenCalledWith(rating);
      expect(result).toEqual(rating);
    });
  });

  describe('calculateAverageRating', () => {
    it('should calculate average rating and count', async () => {
      const contentId = 'content-123';
      const rawResult = {
        average: '4.5',
        count: '10',
      };

      mockQueryBuilder.getRawOne.mockResolvedValue(rawResult);

      const result = await repository.calculateAverageRating(contentId);

      expect(typeormRepository.createQueryBuilder).toHaveBeenCalledWith(
        'rating',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'AVG(rating.rating)',
        'average',
      );
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
        'COUNT(rating.rating)',
        'count',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'rating.contentId = :contentId',
        { contentId },
      );
      expect(result).toEqual({ average: 4.5, count: 10 });
    });

    it('should return 0 for average and count when no ratings exist', async () => {
      const contentId = 'content-123';
      const rawResult = {
        average: null,
        count: null,
      };

      mockQueryBuilder.getRawOne.mockResolvedValue(rawResult);

      const result = await repository.calculateAverageRating(contentId);

      expect(result).toEqual({ average: 0, count: 0 });
    });
  });

  describe('countByUserId', () => {
    it('should count ratings by user ID', async () => {
      const userId = 'user-123';
      const count = 5;

      typeormRepository.count.mockResolvedValue(count);

      const result = await repository.countByUserId(userId);

      expect(typeormRepository.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toBe(count);
    });
  });
});

