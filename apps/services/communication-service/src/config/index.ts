import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6010),
  COMMUNICATION_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/communication_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
  JWT_ACCESS_SECRET: z.string().default('default_jwt_access_secret_32_chars_min'),
  SERVICE_INTERNAL_SECRET: z.string().default('super-secure-internal-microservice-shared-secret-32-chars-min'),
  CUSTOMER_SERVICE_URL: z.string().default('http://localhost:6004'),
  BOOKING_SERVICE_URL: z.string().default('http://localhost:6005'),
  COMMERCE_SERVICE_URL: z.string().default('http://localhost:6006'),
  PAYMENT_SERVICE_URL: z.string().default('http://localhost:6007'),
  SENDGRID_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default('adityapandey9977@gmail.com'),
  SMTP_PASS: z.string().default('pyhn rkqf rkwx cjfu'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.COMMUNICATION_SERVICE_PORT || 6010,
  COMMUNICATION_DATABASE_URL: process.env.COMMUNICATION_DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:6004',
  BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL || 'http://localhost:6005',
  COMMERCE_SERVICE_URL: process.env.COMMERCE_SERVICE_URL || 'http://localhost:6006',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:6007',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'adityapandey9977@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'pyhn rkqf rkwx cjfu',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
});
