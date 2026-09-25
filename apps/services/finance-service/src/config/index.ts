import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6009),
  FINANCE_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/finance_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
  JWT_ACCESS_SECRET: z.string().default('default_jwt_access_secret_32_chars_min'),
  SERVICE_INTERNAL_SECRET: z.string().default('super-secure-internal-microservice-shared-secret-32-chars-min'),
  ORGANIZATION_SERVICE_URL: z.string().default('http://localhost:6002'),
  PEOPLE_SERVICE_URL: z.string().default('http://localhost:6003'),
  COMMERCE_SERVICE_URL: z.string().default('http://localhost:6006'),
  PAYMENT_SERVICE_URL: z.string().default('http://localhost:6007'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.FINANCE_SERVICE_PORT || 6009,
  FINANCE_DATABASE_URL: process.env.FINANCE_DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  ORGANIZATION_SERVICE_URL: process.env.ORGANIZATION_SERVICE_URL || 'http://localhost:6002',
  PEOPLE_SERVICE_URL: process.env.PEOPLE_SERVICE_URL || 'http://localhost:6003',
  COMMERCE_SERVICE_URL: process.env.COMMERCE_SERVICE_URL || 'http://localhost:6006',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:6007',
});
