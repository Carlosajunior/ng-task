import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EnvService } from '@/config/env';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

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

    const secret = this.envService.get('JWT_SECRET');
    const expiresIn = this.envService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION',
    ) as any;

    return this.jwtService.sign(
      payload as any,
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  generateRefreshToken(userId: string, email: string): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      type: 'refresh',
    };

    const secret = this.envService.get('JWT_SECRET');
    const expiresIn = this.envService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION',
    ) as any;

    return this.jwtService.sign(
      payload as any,
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.envService.get('JWT_SECRET'),
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

