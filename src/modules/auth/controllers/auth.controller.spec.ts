import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@/modules/auth/services';
import { LoginDTO, RefreshTokenDTO, AuthResponseDTO } from '@/modules/auth/dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResponse: AuthResponseDTO = {
    accessToken: 'access.token',
    refreshToken: 'refresh.token',
    tokenType: 'Bearer',
    expiresIn: 900,
  };

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login and return auth tokens', async () => {
      const loginDto: LoginDTO = {
        login: 'test@example.com',
        password: 'Password@123',
      };

      authService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and return new tokens', async () => {
      const refreshTokenDto: RefreshTokenDTO = {
        refresh_token: 'refresh.token.here',
      };

      authService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refresh_token,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });
});

