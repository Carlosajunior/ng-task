import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EnvService } from '@/config/env';
import { JwtPayload } from '@/modules/auth/interfaces';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly envService: EnvService,
  ) {}

  generateAccessToken(userId: string, email: string): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      type: 'access',
    };

    const secret = this.envService.get('JWT_SECRET') as string;
    const expiresIn = this.envService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION',
    ) as string;

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  generateRefreshToken(userId: string, email: string): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      type: 'refresh',
    };

    const secret = this.envService.get('JWT_SECRET') as string;
    const expiresIn = this.envService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION',
    ) as string;

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const secret = this.envService.get('JWT_SECRET') as string;
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret,
    });
  }

  getExpirationTime(expiration: string): number {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1));

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 0);
  }
}
