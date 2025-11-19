import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvModule } from '@/config/env';
import { UsersModule } from '@/modules/users/config';
import { AuthController } from '../controllers';
import { AuthService, PasswordService, JwtTokenService } from '../services';
import { JwtStrategy } from '../strategies';

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
