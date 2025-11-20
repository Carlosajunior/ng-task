import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '@/modules/auth/services/password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Password@123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      const password = 'Password@123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockImplementation(() =>
        Promise.resolve(true),
      );

      const result = await service.comparePasswords(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'Password@123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockImplementation(() =>
        Promise.resolve(false),
      );

      const result = await service.comparePasswords(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });
  });
});
