import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindContentService } from '@/modules/contents/services/find-content.service';
import { ContentsRepository } from '@/modules/contents/repositories';
import { ContentCategory } from '@/modules/contents/enums';

describe('FindContentService', () => {
  let service: FindContentService;
  let contentsRepository: jest.Mocked<ContentsRepository>;

  const mockContentsRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindContentService,
        {
          provide: ContentsRepository,
          useValue: mockContentsRepository,
        },
      ],
    }).compile();

    service = module.get<FindContentService>(FindContentService);
    contentsRepository = module.get(ContentsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a content by ID', async () => {
      const contentId = 'content-123';
      const content = {
        id: contentId,
        title: 'Test Game',
        description: 'A great game',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdBy: 'user-123',
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      contentsRepository.findById.mockResolvedValue(content as any);

      const result = await service.execute(contentId);

      expect(contentsRepository.findById).toHaveBeenCalledWith(contentId);
      expect(result).toMatchObject({
        id: content.id,
        title: content.title,
        description: content.description,
      });
    });

    it('should throw NotFoundException when content not found', async () => {
      const contentId = 'non-existent-id';

      contentsRepository.findById.mockResolvedValue(null);

      await expect(service.execute(contentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.execute(contentId)).rejects.toThrow(
        `Content with ID ${contentId} not found`,
      );
    });
  });
});
