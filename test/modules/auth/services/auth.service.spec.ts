import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UsersRepository } from '@/modules/users/repositories';
import { PasswordService } from '@/modules/auth/services/password.service';
import { JwtTokenService } from '@/modules/auth/services/jwt.service';
import { EnvService } from '@/config/env';
import { LoginDTO } from '@/modules/auth/dtos';
import { User } from '@/modules/users/entities';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;
  let jwtTokenService: jest.Mocked<JwtTokenService>;
  let envService: jest.Mocked<EnvService>;

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
    const mockUsersRepository = {
      findByEmailOrUsername: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

    const mockPasswordService = {
      comparePasswords: jest.fn(),
    };

    const mockJwtTokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyToken: jest.fn(),
      getExpirationTime: jest.fn(),
    };

    const mockEnvService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    passwordService = module.get(PasswordService);
    jwtTokenService = module.get(JwtTokenService);
    envService = module.get(EnvService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDTO = {
      login: 'test@example.com',
      password: 'Password@123',
    };

    it('should login successfully and return tokens', async () => {
      usersRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      passwordService.comparePasswords.mockResolvedValue(true);
      jwtTokenService.generateAccessToken.mockReturnValue('access.token');
      jwtTokenService.generateRefreshToken.mockReturnValue('refresh.token');
      jwtTokenService.getExpirationTime.mockReturnValue(900);
      envService.get.mockReturnValue('15m');
      usersRepository.update.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(usersRepository.findByEmailOrUsername).toHaveBeenCalledWith(
        loginDto.login,
        true,
      );
      expect(passwordService.comparePasswords).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(usersRepository.update).toHaveBeenCalledWith(mockUser.id, {
        lastLogin: expect.any(Date),
      });
      expect(result).toEqual({
        accessToken: 'access.token',
        refreshToken: 'refresh.token',
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersRepository.findByEmailOrUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(passwordService.comparePasswords).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      passwordService.comparePasswords.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(usersRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'refresh.token.here';

    it('should refresh token successfully', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'refresh' as const,
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      jwtTokenService.verifyToken.mockResolvedValue(payload);
      usersRepository.findById.mockResolvedValue(mockUser);
      jwtTokenService.generateAccessToken.mockReturnValue('new.access.token');
      jwtTokenService.generateRefreshToken.mockReturnValue('new.refresh.token');
      jwtTokenService.getExpirationTime.mockReturnValue(900);
      envService.get.mockReturnValue('15m');

      const result = await service.refreshToken(refreshToken);

      expect(jwtTokenService.verifyToken).toHaveBeenCalledWith(refreshToken);
      expect(usersRepository.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        accessToken: 'new.access.token',
        refreshToken: 'new.refresh.token',
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });

    it('should throw UnauthorizedException when token type is invalid', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'access' as const,
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      jwtTokenService.verifyToken.mockResolvedValue(payload);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        type: 'refresh' as const,
        iat: Date.now(),
        exp: Date.now() + 3600,
      };

      jwtTokenService.verifyToken.mockResolvedValue(payload);
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      jwtTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when found', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.validateUser('123');

      expect(usersRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.validateUser('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('generateAuthResponse', () => {
    it('should generate auth response with tokens', () => {
      jwtTokenService.generateAccessToken.mockReturnValue('access.token');
      jwtTokenService.generateRefreshToken.mockReturnValue('refresh.token');
      jwtTokenService.getExpirationTime.mockReturnValue(900);
      envService.get.mockReturnValue('15m');

      const result = service.generateAuthResponse('123', 'test@example.com');

      expect(result).toEqual({
        accessToken: 'access.token',
        refreshToken: 'refresh.token',
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });
  });
});
