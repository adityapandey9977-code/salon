import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    FINANCE_DATABASE_URL: z.ZodDefault<z.ZodString>;
    REDIS_URL: z.ZodDefault<z.ZodString>;
    RABBITMQ_URL: z.ZodDefault<z.ZodString>;
    JWT_ACCESS_SECRET: z.ZodDefault<z.ZodString>;
    SERVICE_INTERNAL_SECRET: z.ZodDefault<z.ZodString>;
    ORGANIZATION_SERVICE_URL: z.ZodDefault<z.ZodString>;
    PEOPLE_SERVICE_URL: z.ZodDefault<z.ZodString>;
    COMMERCE_SERVICE_URL: z.ZodDefault<z.ZodString>;
    PAYMENT_SERVICE_URL: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    FINANCE_DATABASE_URL: string;
    REDIS_URL: string;
    RABBITMQ_URL: string;
    JWT_ACCESS_SECRET: string;
    SERVICE_INTERNAL_SECRET: string;
    ORGANIZATION_SERVICE_URL: string;
    PEOPLE_SERVICE_URL: string;
    COMMERCE_SERVICE_URL: string;
    PAYMENT_SERVICE_URL: string;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    FINANCE_DATABASE_URL?: string | undefined;
    REDIS_URL?: string | undefined;
    RABBITMQ_URL?: string | undefined;
    JWT_ACCESS_SECRET?: string | undefined;
    SERVICE_INTERNAL_SECRET?: string | undefined;
    ORGANIZATION_SERVICE_URL?: string | undefined;
    PEOPLE_SERVICE_URL?: string | undefined;
    COMMERCE_SERVICE_URL?: string | undefined;
    PAYMENT_SERVICE_URL?: string | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const config: Config;
export {};
//# sourceMappingURL=index.d.ts.map