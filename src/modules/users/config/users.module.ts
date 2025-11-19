import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories';
import {
  CreateUserService,
  UpdateUserService,
  DeleteUserService,
} from '../services';
import { UsersController } from '../controllers';
import { AuthModule } from '@/modules/auth/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}

