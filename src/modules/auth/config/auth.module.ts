import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvModule } from '@/config/env';
import { UsersModule } from '@/modules/users/config';
import { AuthController } from '@/modules/auth/controllers';
import {
  AuthService,
  PasswordService,
  JwtTokenService,
} from '@/modules/auth/services';
import { JwtStrategy } from '@/modules/auth/strategies';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    EnvModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, JwtTokenService, JwtStrategy],
  exports: [AuthService, JwtTokenService, PasswordService],
})
export class AuthModule {}
