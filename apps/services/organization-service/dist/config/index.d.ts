import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    ORGANIZATION_DATABASE_URL: z.ZodDefault<z.ZodString>;
    REDIS_URL: z.ZodDefault<z.ZodString>;
    RABBITMQ_URL: z.ZodDefault<z.ZodString>;
    IDENTITY_SERVICE_URL: z.ZodDefault<z.ZodString>;
    SERVICE_INTERNAL_SECRET: z.ZodDefault<z.ZodString>;
    SMTP_HOST: z.ZodDefault<z.ZodString>;
    SMTP_PORT: z.ZodDefault<z.ZodNumber>;
    SMTP_USER: z.ZodDefault<z.ZodString>;
    SMTP_PASS: z.ZodDefault<z.ZodString>;
    APP_LOGIN_URL: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    ORGANIZATION_DATABASE_URL: string;
    REDIS_URL: string;
    RABBITMQ_URL: string;
    IDENTITY_SERVICE_URL: string;
    SERVICE_INTERNAL_SECRET: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    APP_LOGIN_URL: string;
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    ORGANIZATION_DATABASE_URL?: string | undefined;
    REDIS_URL?: string | undefined;
    RABBITMQ_URL?: string | undefined;
    IDENTITY_SERVICE_URL?: string | undefined;
    SERVICE_INTERNAL_SECRET?: string | undefined;
    SMTP_HOST?: string | undefined;
    SMTP_PORT?: number | undefined;
    SMTP_USER?: string | undefined;
    SMTP_PASS?: string | undefined;
    APP_LOGIN_URL?: string | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const config: Config;
export {};
//# sourceMappingURL=index.d.ts.map