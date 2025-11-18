import { z } from 'zod';

export const envSchema = z.object({
  // Application
  APP_NAME: z.string().default('BFF Service'),
  APP_DESCRIPTION: z.string().default('Backend For Frontend'),
  APP_VERSION: z.string().default('1.0.0'),
  APP_PORT: z.coerce.number().int().positive().default(3000),
  SWAGGER_PATH: z.string().default('api'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;
