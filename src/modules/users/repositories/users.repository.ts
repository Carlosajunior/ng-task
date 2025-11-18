import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * Repository for User entity operations
 */
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * @param userData - User data
   * @returns Created user
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  /**
   * Find user by email
   * @param email - User email
   * @param includePassword - Include password in result
   * @returns User or null
   */
  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    const query = this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }

  /**
   * Find user by username
   * @param username - Username
   * @returns User or null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  /**
   * Find user by ID
   * @param userId - User ID
   * @returns User or null
   */
  async findById(userId: string): Promise<User | null> {
    return this.repository.findOne({ where: { user_id: userId } });
  }

  /**
   * Update last login timestamp
   * @param userId - User ID
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.repository.update(userId, { last_login: new Date() });
  }

  /**
   * Increment rating count
   * @param userId - User ID
   */
  async incrementRatingCount(userId: string): Promise<void> {
    await this.repository.increment({ user_id: userId }, 'rating_count', 1);
  }
}

