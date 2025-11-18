import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Env } from './handler';

/**
 * Service to access environment variables with type safety.
 * Provides a strongly-typed wrapper around ConfigService.
 */
@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  /**
   * Gets an environment variable value with full type inference.
   * @param key - The environment variable key
   * @returns The typed value of the environment variable
   */
  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get(key, { infer: true });
  }
}
