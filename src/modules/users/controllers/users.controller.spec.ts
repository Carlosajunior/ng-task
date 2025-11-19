import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {
  CreateUserService,
  UpdateUserService,
  DeleteUserService,
} from '@/modules/users/services';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '@/modules/users/dtos';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserService: jest.Mocked<CreateUserService>;
  let updateUserService: jest.Mocked<UpdateUserService>;
  let deleteUserService: jest.Mocked<DeleteUserService>;

  const mockUserResponse: UserResponseDTO = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'Test User',
    ratingCount: 0,
    lastLogin: null,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockCreateUserService = {
      execute: jest.fn(),
    };

    const mockUpdateUserService = {
      execute: jest.fn(),
    };

    const mockDeleteUserService = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserService,
          useValue: mockCreateUserService,
        },
        {
          provide: UpdateUserService,
          useValue: mockUpdateUserService,
        },
        {
          provide: DeleteUserService,
          useValue: mockDeleteUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    createUserService = module.get(CreateUserService);
    updateUserService = module.get(UpdateUserService);
    deleteUserService = module.get(DeleteUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDTO = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password@123',
        fullName: 'Test User',
      };

      createUserService.execute.mockResolvedValue(mockUserResponse);

      const result = await controller.create(createUserDto);

      expect(createUserService.execute).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserDto: UpdateUserDTO = {
        fullName: 'Updated Name',
      };

      updateUserService.execute.mockResolvedValue({
        ...mockUserResponse,
        fullName: 'Updated Name',
      });

      const result = await controller.update(userId, updateUserDto);

      expect(updateUserService.execute).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(result.fullName).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      deleteUserService.execute.mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(deleteUserService.execute).toHaveBeenCalledWith(userId);
    });
  });
});

