import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { PasswordService } from '@/modules/auth/services';
import { CreateUserDTO, UserResponseDTO } from '../dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return plainToInstance(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}

