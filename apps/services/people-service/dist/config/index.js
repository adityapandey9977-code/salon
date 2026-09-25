import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();
const ConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(6003),
    PEOPLE_DATABASE_URL: z
        .string()
        .default('postgresql://postgres:postgres@localhost:5432/people_db?schema=public'),
    DB_CONNECTION_LIMIT: z.coerce.number().default(10),
    DB_POOL_TIMEOUT: z.coerce.number().default(10),
    REDIS_URL: z.string().default('redis://localhost:6379'),
    REDIS_CONNECT_TIMEOUT: z.coerce.number().default(10000),
    REDIS_COMMAND_TIMEOUT: z.coerce.number().default(5000),
    REDIS_MAX_RETRIES: z.coerce.number().default(5),
    REDIS_RECONNECT_DELAY: z.coerce.number().default(500),
    RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
    JWT_ACCESS_SECRET: z.string().default('default_jwt_access_secret_32_chars_min'),
    SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),
    ORGANIZATION_SERVICE_URL: z.string().default('http://localhost:6002'),
    IDENTITY_SERVICE_URL: z.string().default('http://localhost:6001'),
    COMMERCE_SERVICE_URL: z.string().default('http://localhost:6006'),
    // Cache TTLs in seconds
    STAFF_CACHE_TTL: z.coerce.number().default(3600),
    STAFF_BRANCH_CACHE_TTL: z.coerce.number().default(1800),
    STAFF_SKILL_CACHE_TTL: z.coerce.number().default(3600),
    ROSTER_CACHE_TTL: z.coerce.number().default(900),
    SHIFT_CACHE_TTL: z.coerce.number().default(3600),
    // Encryption key for sensitive HR data (32 bytes hex or string)
    HR_ENCRYPTION_KEY: z
        .string()
        .default('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
});
export const config = ConfigSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PEOPLE_SERVICE_PORT || 6003,
    PEOPLE_DATABASE_URL: process.env.PEOPLE_DATABASE_URL,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
    DB_POOL_TIMEOUT: process.env.DB_POOL_TIMEOUT,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_CONNECT_TIMEOUT: process.env.REDIS_CONNECT_TIMEOUT,
    REDIS_COMMAND_TIMEOUT: process.env.REDIS_COMMAND_TIMEOUT,
    REDIS_MAX_RETRIES: process.env.REDIS_MAX_RETRIES,
    REDIS_RECONNECT_DELAY: process.env.REDIS_RECONNECT_DELAY,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
    ORGANIZATION_SERVICE_URL: process.env.ORGANIZATION_SERVICE_URL || 'http://localhost:6002',
    IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL || 'http://localhost:6001',
    COMMERCE_SERVICE_URL: process.env.COMMERCE_SERVICE_URL || 'http://localhost:6006',
    STAFF_CACHE_TTL: process.env.STAFF_CACHE_TTL,
    STAFF_BRANCH_CACHE_TTL: process.env.STAFF_BRANCH_CACHE_TTL,
    STAFF_SKILL_CACHE_TTL: process.env.STAFF_SKILL_CACHE_TTL,
    ROSTER_CACHE_TTL: process.env.ROSTER_CACHE_TTL,
    SHIFT_CACHE_TTL: process.env.SHIFT_CACHE_TTL,
    HR_ENCRYPTION_KEY: process.env.HR_ENCRYPTION_KEY,
});
