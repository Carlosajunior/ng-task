import { Test, TestingModule } from '@nestjs/testing';
import { ListContentsService } from '@/modules/contents/services/list-contents.service';
import { ContentsRepository } from '@/modules/contents/repositories';
import { ContentCategory, ContentSortBy } from '@/modules/contents/enums';
import { SortOrder } from '@/common/enums';

describe('ListContentsService', () => {
  let service: ListContentsService;
  let contentsRepository: jest.Mocked<ContentsRepository>;

  const mockContentsRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListContentsService,
        {
          provide: ContentsRepository,
          useValue: mockContentsRepository,
        },
      ],
    }).compile();

    service = module.get<ListContentsService>(ListContentsService);
    contentsRepository = module.get(ContentsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
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
        {
          id: 'content-2',
          title: 'Game 2',
          description: 'Description 2',
          category: ContentCategory.GAME,
          thumbnailUrl: 'https://example.com/2.jpg',
          createdBy: 'user-456',
          status: true,
          ratings: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const total = 2;

      contentsRepository.findAll.mockResolvedValue([contents as any, total]);

      const result = await service.execute(queryDto);

      expect(contentsRepository.findAll).toHaveBeenCalledWith(queryDto);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(total);
      expect(result.pagination.page).toBe(queryDto.page);
      expect(result.pagination.limit).toBe(queryDto.limit);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should return empty array when no contents found', async () => {
      const queryDto = {
        page: 1,
        limit: 10,
        sortBy: ContentSortBy.CREATED_AT,
        order: SortOrder.DESC,
      };

      contentsRepository.findAll.mockResolvedValue([[], 0]);

      const result = await service.execute(queryDto);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });
});
