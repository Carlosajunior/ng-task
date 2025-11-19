import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { UsersRepository } from '@/modules/users/repositories';
import { PasswordService } from '@/modules/auth/services';
import { CreateUserDTO } from '@/modules/users/dtos';
import { User } from '@/modules/users/entities';

describe('CreateUserService', () => {
  let service: CreateUserService;
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
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
    };

    const mockPasswordService = {
      hashPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
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

    service = module.get<CreateUserService>(CreateUserService);
    usersRepository = module.get(UsersRepository);
    passwordService = module.get(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const createUserDto: CreateUserDTO = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password@123',
      fullName: 'Test User',
    };

    it('should create a new user successfully', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      passwordService.hashPassword.mockResolvedValue('hashedPassword');
      usersRepository.create.mockResolvedValue(mockUser);

      const result = await service.execute(createUserDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersRepository.findByUsername).toHaveBeenCalledWith(
        createUserDto.username,
      );
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException when email already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.execute(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.execute(createUserDto)).rejects.toThrow(
        'Email already registered',
      );

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersRepository.findByUsername).not.toHaveBeenCalled();
      expect(passwordService.hashPassword).not.toHaveBeenCalled();
      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when username already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(service.execute(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.execute(createUserDto)).rejects.toThrow(
        'Username already taken',
      );

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(usersRepository.findByUsername).toHaveBeenCalledWith(
        createUserDto.username,
      );
      expect(passwordService.hashPassword).not.toHaveBeenCalled();
      expect(usersRepository.create).not.toHaveBeenCalled();
    });
  });
});

