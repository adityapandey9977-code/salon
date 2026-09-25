import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6005),
  BOOKING_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/booking_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
  SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),
  JWT_SECRET: z.string().default('your_jwt_access_secret_min_32_characters_long_key'),
  CUSTOMER_SERVICE_URL: z.string().default('http://localhost:6004'),
  COMMERCE_SERVICE_URL: z.string().default('http://localhost:6006'),
  PEOPLE_SERVICE_URL: z.string().default('http://localhost:6003'),
  ORGANIZATION_SERVICE_URL: z.string().default('http://localhost:6002'),
  PAYMENT_SERVICE_URL: z.string().default('http://localhost:6007'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.BOOKING_SERVICE_PORT || 6005,
  BOOKING_DATABASE_URL: process.env.BOOKING_DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  JWT_SECRET: process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret_min_32_characters_long_key',
  CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:6004',
  COMMERCE_SERVICE_URL: process.env.COMMERCE_SERVICE_URL || 'http://localhost:6006',
  PEOPLE_SERVICE_URL: process.env.PEOPLE_SERVICE_URL || 'http://localhost:6003',
  ORGANIZATION_SERVICE_URL: process.env.ORGANIZATION_SERVICE_URL || 'http://localhost:6002',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:6007',
});
