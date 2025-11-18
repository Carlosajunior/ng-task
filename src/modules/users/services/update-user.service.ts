import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { PasswordService } from '@/modules/auth/services';
import { UpdateUserDTO, UserResponseDTO } from '../dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(
    id: string,
    updateUserDto: UpdateUserDTO,
  ): Promise<UserResponseDTO> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }

    const dataToUpdate: Partial<typeof updateUserDto> = { ...updateUserDto };

    if (updateUserDto.password) {
      dataToUpdate.password = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
    }

    const updatedUser = await this.usersRepository.update(id, dataToUpdate);

    return plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}

