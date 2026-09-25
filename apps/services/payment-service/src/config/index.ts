import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6007),
  PAYMENT_DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/payment_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
  SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),
  JWT_SECRET: z.string().default('your-256-bit-secret'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_key_id'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_test_key_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('rzp_test_webhook_secret'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_mock_stripe_key'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_mock_stripe_webhook_secret'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config: Config = ConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PAYMENT_SERVICE_PORT || 6007,
  PAYMENT_DATABASE_URL: process.env.PAYMENT_DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
});
