import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities';
import { UsersRepository } from '@/modules/users/repositories';
import {
  CreateUserService,
  UpdateUserService,
  DeleteUserService,
} from '@/modules/users/services';
import { UsersController } from '@/modules/users/controllers';
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

