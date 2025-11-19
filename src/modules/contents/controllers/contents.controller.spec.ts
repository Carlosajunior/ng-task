import { Test, TestingModule } from '@nestjs/testing';
import { ContentsController } from './contents.controller';
import {
  CreateContentService,
  FindContentService,
  ListContentsService,
  UpdateContentService,
  DeleteContentService,
} from '@/modules/contents/services';
import { ContentCategory, ContentSortBy } from '@/modules/contents/enums';
import { SortOrder } from '@/common/enums';

describe('ContentsController', () => {
  let controller: ContentsController;
  let createContentService: jest.Mocked<CreateContentService>;
  let findContentService: jest.Mocked<FindContentService>;
  let listContentsService: jest.Mocked<ListContentsService>;
  let updateContentService: jest.Mocked<UpdateContentService>;
  let deleteContentService: jest.Mocked<DeleteContentService>;

  const mockCreateContentService = {
    execute: jest.fn(),
  };

  const mockFindContentService = {
    execute: jest.fn(),
  };

  const mockListContentsService = {
    execute: jest.fn(),
  };

  const mockUpdateContentService = {
    execute: jest.fn(),
  };

  const mockDeleteContentService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentsController],
      providers: [
        {
          provide: CreateContentService,
          useValue: mockCreateContentService,
        },
        {
          provide: FindContentService,
          useValue: mockFindContentService,
        },
        {
          provide: ListContentsService,
          useValue: mockListContentsService,
        },
        {
          provide: UpdateContentService,
          useValue: mockUpdateContentService,
        },
        {
          provide: DeleteContentService,
          useValue: mockDeleteContentService,
        },
      ],
    }).compile();

    controller = module.get<ContentsController>(ContentsController);
    createContentService = module.get(CreateContentService);
    findContentService = module.get(FindContentService);
    listContentsService = module.get(ListContentsService);
    updateContentService = module.get(UpdateContentService);
    deleteContentService = module.get(DeleteContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new content', async () => {
      const createDto = {
        title: 'Test Game',
        description: 'A great game',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
      };

      const user = { id: 'user-123', email: 'test@example.com' };

      const createdContent = {
        id: 'content-123',
        ...createDto,
        createdBy: user.id,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createContentService.execute.mockResolvedValue(createdContent as any);

      const result = await controller.create(createDto, user);

      expect(createContentService.execute).toHaveBeenCalledWith(
        createDto,
        user.id,
      );
      expect(result).toEqual(createdContent);
    });
  });

  describe('findAll', () => {
    it('should return paginated contents', async () => {
      const queryDto = {
        page: 1,
        limit: 10,
        sortBy: ContentSortBy.CREATED_AT,
        order: SortOrder.DESC,
      };

      const contents = [
        {
          id: 'content-1',
          title: 'Game 1',
          description: 'Description 1',
          category: ContentCategory.GAME,
          thumbnailUrl: 'https://example.com/1.jpg',
          createdBy: 'user-123',
          status: true,
          ratings: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const paginatedResponse = {
        data: contents,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      listContentsService.execute.mockResolvedValue(paginatedResponse as any);

      const result = await controller.findAll(queryDto);

      expect(listContentsService.execute).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
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

      findContentService.execute.mockResolvedValue(content as any);

      const result = await controller.findOne(contentId);

      expect(findContentService.execute).toHaveBeenCalledWith(contentId);
      expect(result).toEqual(content);
    });
  });

  describe('update', () => {
    it('should update a content', async () => {
      const contentId = 'content-123';
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const user = { id: 'user-123', email: 'test@example.com' };

      const updatedContent = {
        id: contentId,
        ...updateDto,
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdBy: user.id,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      updateContentService.execute.mockResolvedValue(updatedContent as any);

      const result = await controller.update(contentId, updateDto, user);

      expect(updateContentService.execute).toHaveBeenCalledWith(
        contentId,
        updateDto,
        user.id,
      );
      expect(result).toEqual(updatedContent);
    });
  });

  describe('remove', () => {
    it('should delete a content', async () => {
      const contentId = 'content-123';
      const user = { id: 'user-123', email: 'test@example.com' };

      deleteContentService.execute.mockResolvedValue(undefined);

      await controller.remove(contentId, user);

      expect(deleteContentService.execute).toHaveBeenCalledWith(
        contentId,
        user.id,
      );
    });
  });
});

