import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
// Load root workspace .env first, then local .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();
const GatewayConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3030),
    REDIS_URL: z.string().default('redis://localhost:6379'),
    JWT_ACCESS_SECRET: z.string().default('default_jwt_access_secret_32_chars_min'),
    SERVICE_INTERNAL_SECRET: z.string().default('default_internal_secret_32_chars_minimum'),
    // Downstream service target URLs
    IDENTITY_SERVICE_URL: z.string().default('http://localhost:6001'),
    ORGANIZATION_SERVICE_URL: z.string().default('http://localhost:6002'),
    PEOPLE_SERVICE_URL: z.string().default('http://localhost:6003'),
    CUSTOMER_SERVICE_URL: z.string().default('http://localhost:6004'),
    BOOKING_SERVICE_URL: z.string().default('http://localhost:6005'),
    COMMERCE_SERVICE_URL: z.string().default('http://localhost:6006'),
    PAYMENT_SERVICE_URL: z.string().default('http://localhost:6007'),
    INVENTORY_SERVICE_URL: z.string().default('http://localhost:6008'),
    FINANCE_SERVICE_URL: z.string().default('http://localhost:6009'),
    COMMUNICATION_SERVICE_URL: z.string().default('http://localhost:6010'),
    PLATFORM_SERVICE_URL: z.string().default('http://localhost:6011'),
    REPORTING_SERVICE_URL: z.string().default('http://localhost:6012'),
});
export const gatewayConfig = GatewayConfigSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || process.env.API_GATEWAY_PORT || process.env.GATEWAY_PORT || 3030,
    REDIS_URL: process.env.REDIS_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    SERVICE_INTERNAL_SECRET: process.env.SERVICE_INTERNAL_SECRET,
    IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL,
    ORGANIZATION_SERVICE_URL: process.env.ORGANIZATION_SERVICE_URL,
    PEOPLE_SERVICE_URL: process.env.PEOPLE_SERVICE_URL,
    CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL,
    COMMERCE_SERVICE_URL: process.env.COMMERCE_SERVICE_URL,
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
    PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL,
    INVENTORY_SERVICE_URL: process.env.INVENTORY_SERVICE_URL,
    FINANCE_SERVICE_URL: process.env.FINANCE_SERVICE_URL,
    COMMUNICATION_SERVICE_URL: process.env.COMMUNICATION_SERVICE_URL,
    PLATFORM_SERVICE_URL: process.env.PLATFORM_SERVICE_URL,
    REPORTING_SERVICE_URL: process.env.REPORTING_SERVICE_URL,
});
