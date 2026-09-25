import { z } from 'zod';
export declare const RequestContextSchema: z.ZodObject<{
    requestId: z.ZodString;
    correlationId: z.ZodString;
    userId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tenantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    requestId: string;
    correlationId: string;
    branchIds: string[];
    permissions: string[];
    userId?: string | null | undefined;
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    role?: string | null | undefined;
}, {
    requestId: string;
    correlationId: string;
    userId?: string | null | undefined;
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    branchIds?: string[] | undefined;
    role?: string | null | undefined;
    permissions?: string[] | undefined;
}>;
export type RequestContext = z.infer<typeof RequestContextSchema>;
//# sourceMappingURL=context.d.ts.map