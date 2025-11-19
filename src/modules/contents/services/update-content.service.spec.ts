import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateContentService } from './update-content.service';
import { ContentsRepository } from '@/modules/contents/repositories';
import { ContentCategory } from '@/modules/contents/enums';

describe('UpdateContentService', () => {
  let service: UpdateContentService;
  let contentsRepository: jest.Mocked<ContentsRepository>;

  const mockContentsRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateContentService,
        {
          provide: ContentsRepository,
          useValue: mockContentsRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateContentService>(UpdateContentService);
    contentsRepository = module.get(ContentsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a content successfully', async () => {
      const contentId = 'content-123';
      const userId = 'user-123';
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const existingContent = {
        id: contentId,
        title: 'Old Title',
        description: 'Old Description',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdBy: userId,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedContent = {
        ...existingContent,
        ...updateDto,
      };

      contentsRepository.findById.mockResolvedValue(existingContent as any);
      contentsRepository.update.mockResolvedValue(updatedContent as any);

      const result = await service.execute(contentId, updateDto, userId);

      expect(contentsRepository.findById).toHaveBeenCalledWith(contentId);
      expect(contentsRepository.update).toHaveBeenCalledWith(
        contentId,
        updateDto,
      );
      expect(result).toMatchObject({
        id: contentId,
        title: updateDto.title,
        description: updateDto.description,
      });
    });

    it('should throw NotFoundException when content not found', async () => {
      const contentId = 'non-existent-id';
      const userId = 'user-123';
      const updateDto = { title: 'Updated Title' };

      contentsRepository.findById.mockResolvedValue(null);

      await expect(
        service.execute(contentId, updateDto, userId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.execute(contentId, updateDto, userId),
      ).rejects.toThrow(`Content with ID ${contentId} not found`);
    });

    it('should throw ForbiddenException when user is not the creator', async () => {
      const contentId = 'content-123';
      const userId = 'user-123';
      const differentUserId = 'user-456';
      const updateDto = { title: 'Updated Title' };

      const existingContent = {
        id: contentId,
        title: 'Old Title',
        description: 'Old Description',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdBy: differentUserId,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      contentsRepository.findById.mockResolvedValue(existingContent as any);

      await expect(
        service.execute(contentId, updateDto, userId),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.execute(contentId, updateDto, userId),
      ).rejects.toThrow('You can only update contents created by you');
    });
  });
});

