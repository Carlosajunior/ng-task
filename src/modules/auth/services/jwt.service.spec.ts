import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { EnvService } from '@/config/env';

describe('JwtTokenService', () => {
  let service: JwtTokenService;
  let jwtService: jest.Mocked<NestJwtService>;
  let envService: jest.Mocked<EnvService>;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockEnvService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        {
          provide: NestJwtService,
          useValue: mockJwtService,
        },
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
      ],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
    jwtService = module.get(NestJwtService);
    envService = module.get(EnvService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate access token', () => {
      const userId = '123';
      const email = 'test@example.com';
      const token = 'access.token.here';

      envService.get.mockReturnValue('secret');
      jwtService.sign.mockReturnValue(token);

      const result = service.generateAccessToken(userId, email);

      expect(envService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(envService.get).toHaveBeenCalledWith('JWT_ACCESS_TOKEN_EXPIRATION');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: userId, email, type: 'access' },
        expect.any(Object),
      );
      expect(result).toBe(token);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token', () => {
      const userId = '123';
      const email = 'test@example.com';
      const token = 'refresh.token.here';

      envService.get.mockReturnValue('secret');
      jwtService.sign.mockReturnValue(token);

      const result = service.generateRefreshToken(userId, email);

      expect(envService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(envService.get).toHaveBeenCalledWith(
        'JWT_REFRESH_TOKEN_EXPIRATION',
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: userId, email, type: 'refresh' },
        expect.any(Object),
      );
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const token = 'valid.token.here';
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'access',
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      envService.get.mockReturnValue('secret');
      (jwtService as any).verifyAsync = jest.fn().mockResolvedValue(payload);

      const result = await service.verifyToken(token);

      expect(envService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect((jwtService as any).verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'secret',
      });
      expect(result).toEqual(payload);
    });
  });

  describe('getExpirationTime', () => {
    it('should convert minutes to seconds', () => {
      const result = service.getExpirationTime('15m');
      expect(result).toBe(900);
    });

    it('should convert hours to seconds', () => {
      const result = service.getExpirationTime('1h');
      expect(result).toBe(3600);
    });

    it('should convert days to seconds', () => {
      const result = service.getExpirationTime('7d');
      expect(result).toBe(604800);
    });

    it('should convert seconds to seconds', () => {
      const result = service.getExpirationTime('30s');
      expect(result).toBe(30);
    });

    it('should return 0 for unknown unit', () => {
      const result = service.getExpirationTime('5x');
      expect(result).toBe(0);
    });

    it('should return NaN for invalid format', () => {
      const result = service.getExpirationTime('invalid');
      expect(result).toBeNaN();
    });
  });
});

