import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from '@/modules/users/repositories';
import { PasswordService } from '@/modules/auth/services';
import { CreateUserDTO, UserResponseDTO } from '@/modules/users/dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUserByEmail = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUserByUsername = await this.usersRepository.findByUsername(
      createUserDto.username,
    );

    if (existingUserByUsername) {
      throw new ConflictException('Username already taken');
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

