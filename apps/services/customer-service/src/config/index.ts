import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6004),
  CUSTOMER_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/customer_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
  SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),
  JWT_SECRET: z.string().default('jwt_secret_for_dev_mode_testing_purposes_only'),
  CUSTOMER_CACHE_TTL: z.coerce.number().default(1800), // 30 minutes
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.CUSTOMER_SERVICE_PORT || 6004,
  CUSTOMER_DATABASE_URL: process.env.CUSTOMER_DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  CUSTOMER_CACHE_TTL: process.env.CUSTOMER_CACHE_TTL,
});
