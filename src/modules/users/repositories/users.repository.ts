import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

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

  async findById(userId: string): Promise<User | null> {
    return this.repository.findOne({ where: { id: userId } });
  }

  async update(userId: string, data: Partial<User>): Promise<User> {
    await this.repository.update(userId, data);
    return this.findById(userId);
  }

  async delete(userId: string): Promise<void> {
    await this.repository.delete(userId);
  }

  async exists(userId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id: userId } });
    return count > 0;
  }
}

