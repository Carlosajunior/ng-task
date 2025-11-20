import { Test, TestingModule } from '@nestjs/testing';
import { CreateContentService } from '@/modules/contents/services/create-content.service';
import { ContentsRepository } from '@/modules/contents/repositories';
import { ContentCategory } from '@/modules/contents/enums';

describe('CreateContentService', () => {
  let service: CreateContentService;
  let contentsRepository: jest.Mocked<ContentsRepository>;

  const mockContentsRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateContentService,
        {
          provide: ContentsRepository,
          useValue: mockContentsRepository,
        },
      ],
    }).compile();

    service = module.get<CreateContentService>(CreateContentService);
    contentsRepository = module.get(ContentsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new content successfully', async () => {
      const userId = 'user-123';
      const createDto = {
        title: 'Test Game',
        description: 'A great game',
        category: ContentCategory.GAME,
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
      };

      const createdContent = {
        id: 'content-123',
        ...createDto,
        createdBy: userId,
        status: true,
        ratings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      contentsRepository.create.mockResolvedValue(createdContent as any);

      const result = await service.execute(createDto, userId);

      expect(contentsRepository.create).toHaveBeenCalledWith({
        ...createDto,
        createdBy: userId,
        status: true,
      });
      expect(result).toMatchObject({
        id: createdContent.id,
        title: createdContent.title,
        description: createdContent.description,
        category: createdContent.category,
      });
    });
  });
});
