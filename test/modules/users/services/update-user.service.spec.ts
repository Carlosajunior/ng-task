import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateUserService } from '@/modules/users/services/update-user.service';
import { UsersRepository } from '@/modules/users/repositories';
import { PasswordService } from '@/modules/auth/services';
import { UpdateUserDTO } from '@/modules/users/dtos';
import { User } from '@/modules/users/entities';

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let passwordService: jest.Mocked<PasswordService>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
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
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      update: jest.fn(),
    };

    const mockPasswordService = {
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
    usersRepository = module.get(UsersRepository);
    passwordService = module.get(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const updateUserDto: UpdateUserDTO = {
      fullName: 'Updated Name',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, fullName: 'Updated Name' };
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.execute(mockUser.id, updateUserDto);

      expect(usersRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(usersRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result.fullName).toBe('Updated Name');
    });

    it('should throw NotFoundException when user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(
        service.execute('non-existent-id', updateUserDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.execute('non-existent-id', updateUserDto),
      ).rejects.toThrow('User with ID non-existent-id not found');

      expect(usersRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing username', async () => {
      const updateDto = { username: 'existinguser' };
      const existingUser = { ...mockUser, id: 'different-id' };

      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.findByUsername.mockResolvedValue(existingUser);

      await expect(service.execute(mockUser.id, updateDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.execute(mockUser.id, updateDto)).rejects.toThrow(
        'Username already taken',
      );

      expect(usersRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing email', async () => {
      const updateDto = { email: 'existing@example.com' };
      const existingUser = { ...mockUser, id: 'different-id' };

      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.execute(mockUser.id, updateDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.execute(mockUser.id, updateDto)).rejects.toThrow(
        'Email already registered',
      );

      expect(usersRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating to same username', async () => {
      const updateDto = { username: 'testuser' };
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.execute(mockUser.id, updateDto);

      expect(usersRepository.findByUsername).not.toHaveBeenCalled();
      expect(usersRepository.update).toHaveBeenCalled();
    });

    it('should allow updating to same email', async () => {
      const updateDto = { email: 'test@example.com' };
      usersRepository.findById.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue(mockUser);

      await service.execute(mockUser.id, updateDto);

      expect(usersRepository.findByEmail).not.toHaveBeenCalled();
      expect(usersRepository.update).toHaveBeenCalled();
    });

    it('should hash password when updating password', async () => {
      const updateDto = { password: 'NewPassword@123' };
      const updatedUser = { ...mockUser };

      usersRepository.findById.mockResolvedValue(mockUser);
      passwordService.hashPassword.mockResolvedValue('newHashedPassword');
      usersRepository.update.mockResolvedValue(updatedUser);

      await service.execute(mockUser.id, updateDto);

      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        'NewPassword@123',
      );
      expect(usersRepository.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'newHashedPassword',
      });
    });
  });
});
