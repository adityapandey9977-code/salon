import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    CUSTOMER_DATABASE_URL: z.ZodDefault<z.ZodString>;
    REDIS_URL: z.ZodDefault<z.ZodString>;
    RABBITMQ_URL: z.ZodDefault<z.ZodString>;
    SERVICE_INTERNAL_SECRET: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
    CUSTOMER_CACHE_TTL: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    CUSTOMER_DATABASE_URL: string;
    REDIS_URL: string;
    RABBITMQ_URL: string;
    SERVICE_INTERNAL_SECRET: string;
    JWT_SECRET: string;
    CUSTOMER_CACHE_TTL: number;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    CUSTOMER_DATABASE_URL?: string | undefined;
    REDIS_URL?: string | undefined;
    RABBITMQ_URL?: string | undefined;
    SERVICE_INTERNAL_SECRET?: string | undefined;
    JWT_SECRET?: string | undefined;
    CUSTOMER_CACHE_TTL?: number | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const config: Config;
export {};
//# sourceMappingURL=index.d.ts.map