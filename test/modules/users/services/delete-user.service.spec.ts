import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteUserService } from '@/modules/users/services/delete-user.service';
import { UsersRepository } from '@/modules/users/repositories';

describe('DeleteUserService', () => {
  let service: DeleteUserService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const mockUsersRepository = {
      exists: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
    usersRepository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('should delete user successfully', async () => {
      usersRepository.exists.mockResolvedValue(true);
      usersRepository.delete.mockResolvedValue(undefined);

      await service.execute(userId);

      expect(usersRepository.exists).toHaveBeenCalledWith(userId);
      expect(usersRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersRepository.exists.mockResolvedValue(false);

      await expect(service.execute(userId)).rejects.toThrow(NotFoundException);
      await expect(service.execute(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );

      expect(usersRepository.delete).not.toHaveBeenCalled();
    });
  });
});
