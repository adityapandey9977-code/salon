import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6001),
  IDENTITY_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/identity_db?schema=public'),
  DB_CONNECTION_LIMIT: z.coerce.number().default(10),
  DB_POOL_TIMEOUT: z.coerce.number().default(10),

  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_CONNECT_TIMEOUT: z.coerce.number().default(10000),
  REDIS_COMMAND_TIMEOUT: z.coerce.number().default(5000),
  REDIS_MAX_RETRIES: z.coerce.number().default(5),
  REDIS_RECONNECT_DELAY: z.coerce.number().default(500),

  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),

  JWT_ACCESS_SECRET: z.string().default('default_jwt_access_secret_32_chars_min'),
  JWT_REFRESH_SECRET: z.string().default('default_jwt_refresh_secret_32_chars_min'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),

  SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default('adityapandey9977@gmail.com'),
  SMTP_PASS: z.string().default('pyhn rkqf rkwx cjfu'),
  APP_URL: z.string().default('http://localhost:5173'),

  // Cache TTLs in seconds
  USER_PROFILE_CACHE_TTL: z.coerce.number().default(300),
  USER_PERMISSION_CACHE_TTL: z.coerce.number().default(60),
  USER_ROLE_CACHE_TTL: z.coerce.number().default(60),
  USER_SCOPE_CACHE_TTL: z.coerce.number().default(60),
  SESSION_CACHE_TTL: z.coerce.number().default(60),
  MFA_CHALLENGE_CACHE_TTL: z.coerce.number().default(300),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.IDENTITY_SERVICE_PORT || 6001,
  IDENTITY_DATABASE_URL: process.env.IDENTITY_DATABASE_URL,
  DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
  DB_POOL_TIMEOUT: process.env.DB_POOL_TIMEOUT,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_CONNECT_TIMEOUT: process.env.REDIS_CONNECT_TIMEOUT,
  REDIS_COMMAND_TIMEOUT: process.env.REDIS_COMMAND_TIMEOUT,
  REDIS_MAX_RETRIES: process.env.REDIS_MAX_RETRIES,
  REDIS_RECONNECT_DELAY: process.env.REDIS_RECONNECT_DELAY,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL,
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL,
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'adityapandey9977@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'pyhn rkqf rkwx cjfu',
  APP_URL: process.env.APP_URL || 'http://localhost:5173',
  USER_PROFILE_CACHE_TTL: process.env.USER_PROFILE_CACHE_TTL,
  USER_PERMISSION_CACHE_TTL: process.env.USER_PERMISSION_CACHE_TTL,
  USER_ROLE_CACHE_TTL: process.env.USER_ROLE_CACHE_TTL,
  USER_SCOPE_CACHE_TTL: process.env.USER_SCOPE_CACHE_TTL,
  SESSION_CACHE_TTL: process.env.SESSION_CACHE_TTL,
  MFA_CHALLENGE_CACHE_TTL: process.env.MFA_CHALLENGE_CACHE_TTL,
});
