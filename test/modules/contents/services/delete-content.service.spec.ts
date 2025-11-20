import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteContentService } from '@/modules/contents/services/delete-content.service';
import { ContentsRepository } from '@/modules/contents/repositories';
import { ContentCategory } from '@/modules/contents/enums';

describe('DeleteContentService', () => {
  let service: DeleteContentService;
  let contentsRepository: jest.Mocked<ContentsRepository>;

  const mockContentsRepository = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteContentService,
        {
          provide: ContentsRepository,
          useValue: mockContentsRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteContentService>(DeleteContentService);
    contentsRepository = module.get(ContentsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a content successfully', async () => {
      const contentId = 'content-123';
      const userId = 'user-123';

      const existingContent = {
        id: contentId,
        title: 'Test Game',
        description: 'A great game',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdBy: userId,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      contentsRepository.findById.mockResolvedValue(existingContent as any);
      contentsRepository.delete.mockResolvedValue(undefined);

      await service.execute(contentId, userId);

      expect(contentsRepository.findById).toHaveBeenCalledWith(contentId);
      expect(contentsRepository.delete).toHaveBeenCalledWith(contentId);
    });

    it('should throw NotFoundException when content not found', async () => {
      const contentId = 'non-existent-id';
      const userId = 'user-123';

      contentsRepository.findById.mockResolvedValue(null);

      await expect(service.execute(contentId, userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.execute(contentId, userId)).rejects.toThrow(
        `Content with ID ${contentId} not found`,
      );
    });

    it('should throw ForbiddenException when user is not the creator', async () => {
      const contentId = 'content-123';
      const userId = 'user-123';
      const differentUserId = 'user-456';

      const existingContent = {
        id: contentId,
        title: 'Test Game',
        description: 'A great game',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdBy: differentUserId,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      contentsRepository.findById.mockResolvedValue(existingContent as any);

      await expect(service.execute(contentId, userId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.execute(contentId, userId)).rejects.toThrow(
        'You can only delete contents created by you',
      );
    });
  });
});
