import { z } from 'zod';

export const envSchema = z.object({
  APP_NAME: z.string().default('NG Technical Assesment API'),
  APP_DESCRIPTION: z
    .string()
    .default("API designed to attend NG's technical assessment."),
  APP_VERSION: z.string().default('1.0.0'),
  APP_PORT: z.coerce.number().int().positive().default(3000),
  SWAGGER_PATH: z.string().default('api'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),

  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRATION: z.string().default('60m'),
  JWT_REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
});

export type Env = z.infer<typeof envSchema>;
