import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6002),
  ORGANIZATION_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/organization_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
  IDENTITY_SERVICE_URL: z.string().default('http://localhost:6001'),
  SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default('adityapandey9977@gmail.com'),
  SMTP_PASS: z.string().default('pyhn rkqf rkwx cjfu'),
  APP_LOGIN_URL: z.string().default('http://localhost:5173/login'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.ORGANIZATION_SERVICE_PORT || 6002,
  ORGANIZATION_DATABASE_URL: process.env.ORGANIZATION_DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL || 'http://localhost:6001',
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'adityapandey9977@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'pyhn rkqf rkwx cjfu',
  APP_LOGIN_URL: process.env.APP_LOGIN_URL || 'http://localhost:5173/login',
});
