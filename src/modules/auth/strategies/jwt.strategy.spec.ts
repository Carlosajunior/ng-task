import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { EnvService } from '@/config/env';
import { AuthService } from '@/modules/auth/services';
import { User } from '@/modules/users/entities';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let envService: jest.Mocked<EnvService>;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    fullName: 'Test User',
    ratingCount: 0,
    lastLogin: null,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockEnvService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    envService = module.get(EnvService);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate and return user for access token', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'access' as const,
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      authService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(authService.validateUser).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for non-access token type', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'refresh' as const,
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Invalid token type',
      );

      expect(authService.validateUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'access' as const,
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'User not found',
      );
    });
  });
});

