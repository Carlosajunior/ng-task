import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    it('should return true for public routes', () => {
      reflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(result).toBe(true);
    });

    it('should call super.canActivate for protected routes', () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      const superCanActivateSpy = jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalled();
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockContext);

      superCanActivateSpy.mockRestore();
    });
  });
});

