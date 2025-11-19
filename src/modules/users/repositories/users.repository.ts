import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/entities';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = await this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    const query = await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return await query.getOne();
  }

  async findByEmailOrUsername(
    login: string,
    includePassword = false,
  ): Promise<User | null> {
    const query = await this.repository
      .createQueryBuilder('user')
      .where('user.email = :login', { login })
      .orWhere('user.username = :login', { login });

    if (includePassword) {
      query.addSelect('user.password');
    }

    return await query.getOne();
  }

  async findById(userId: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id: userId } });
  }

  async update(userId: string, data: Partial<User>): Promise<User> {
    await this.repository.update(userId, data);
    return await this.findById(userId);
  }

  async delete(userId: string): Promise<void> {
    await this.repository.delete(userId);
  }

  async exists(userId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id: userId } });
    return count > 0;
  }
}
