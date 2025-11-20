import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EnvService } from '@/config/env/env.service';

describe('EnvService', () => {
  let service: EnvService;
  let configService: jest.Mocked<ConfigService>;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EnvService>(EnvService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return environment variable value', () => {
      const key = 'PORT';
      const value = 3000;

      mockConfigService.get.mockReturnValue(value);

      const result = service.get(key as any);

      expect(configService.get).toHaveBeenCalledWith(key, { infer: true });
      expect(result).toBe(value);
    });

    it('should handle string environment variables', () => {
      const key = 'JWT_SECRET';
      const value = 'secret-key-123';

      mockConfigService.get.mockReturnValue(value);

      const result = service.get(key as any);

      expect(configService.get).toHaveBeenCalledWith(key, { infer: true });
      expect(result).toBe(value);
    });

    it('should handle database host', () => {
      const key = 'POSTGRES_HOST';
      const value = 'localhost';

      mockConfigService.get.mockReturnValue(value);

      const result = service.get(key as any);

      expect(configService.get).toHaveBeenCalledWith(key, { infer: true });
      expect(result).toBe(value);
    });
  });
});

