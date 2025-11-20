import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from '@/modules/ratings/controllers/ratings.controller';
import { RateContentService } from '@/modules/ratings/services';

describe('RatingsController', () => {
  let controller: RatingsController;
  let rateContentService: jest.Mocked<RateContentService>;

  const mockRateContentService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        {
          provide: RateContentService,
          useValue: mockRateContentService,
        },
      ],
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    rateContentService = module.get(RateContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rateContent', () => {
    it('should create a new rating', async () => {
      const contentId = 'content-123';
      const user = { id: 'user-123', email: 'test@example.com' };
      const createDto = {
        rating: 5,
        comment: 'Excellent!',
      };

      const createdRating = {
        userId: user.id,
        contentId,
        rating: createDto.rating,
        comment: createDto.comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      rateContentService.execute.mockResolvedValue(createdRating as any);

      const result = await controller.rateContent(contentId, createDto, user);

      expect(rateContentService.execute).toHaveBeenCalledWith(
        contentId,
        user.id,
        createDto,
      );
      expect(result).toEqual(createdRating);
    });
  });
});

