import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { User } from '@/modules/users/entities';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

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
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => mockQueryBuilder),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const userData = { email: 'test@example.com', username: 'testuser' };
      mockRepository.create.mockReturnValue(mockUser as any);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await repository.create(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email without password', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', {
        email: 'test@example.com',
      });
      expect(queryBuilder.addSelect).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should find user by email with password when requested', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com', true);

      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should find user by username without password', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findByUsername('testuser');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'user.username = :username',
        { username: 'testuser' },
      );
      expect(queryBuilder.addSelect).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should find user by username with password when requested', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findByUsername('testuser', true);

      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmailOrUsername', () => {
    it('should find user by email or username', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findByEmailOrUsername('test@example.com');

      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :login', {
        login: 'test@example.com',
      });
      expect(queryBuilder.orWhere).toHaveBeenCalledWith(
        'user.username = :login',
        { login: 'test@example.com' },
      );
      expect(result).toEqual(mockUser);
    });

    it('should include password when requested', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      (queryBuilder.getOne as jest.Mock).mockResolvedValue(mockUser);

      await repository.findByEmailOrUsername('test@example.com', true);

      expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findById(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user and return updated user', async () => {
      const updateData = { fullName: 'Updated Name' };
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      const result = await repository.update(mockUser.id, updateData);

      expect(mockRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        updateData,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result.fullName).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await repository.delete(mockUser.id);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await repository.exists(mockUser.id);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await repository.exists('non-existent-id');

      expect(result).toBe(false);
    });
  });
});

