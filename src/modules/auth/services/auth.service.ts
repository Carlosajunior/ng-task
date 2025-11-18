import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from '@/modules/users/repositories';
import { PasswordService } from './password.service';
import { JwtTokenService } from './jwt.service';
import { LoginDTO, AuthResponseDTO } from '../dtos';
import { EnvService } from '@/config/env';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly envService: EnvService,
  ) {}

  async login(loginDto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.usersRepository.findByEmail(loginDto.email, true);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user.id, user.email);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDTO> {
    try {
      const payload = await this.jwtTokenService.verifyToken(refreshToken);

      if (payload.type !== 'refresh') {
        throw new BadRequestException('Invalid token type');
      }

      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateAuthResponse(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.usersRepository.findById(userId);
  }

  generateAuthResponse(userId: string, email: string): AuthResponseDTO {
    const accessToken = this.jwtTokenService.generateAccessToken(
      userId,
      email,
    );
    const refreshToken = this.jwtTokenService.generateRefreshToken(
      userId,
      email,
    );

    const expiresIn = this.jwtTokenService.getExpirationTime(
      this.envService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      user: {
        id: userId,
        email,
      },
    };
  }
}

