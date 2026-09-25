import { z } from 'zod';
export declare const DashboardStatsQuerySchema: z.ZodObject<{
    branchId: z.ZodOptional<z.ZodString>;
    franchiseId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startDate: string;
    endDate: string;
    franchiseId?: string | undefined;
    branchId?: string | undefined;
}, {
    startDate: string;
    endDate: string;
    franchiseId?: string | undefined;
    branchId?: string | undefined;
}>;
export type DashboardStatsQuery = z.infer<typeof DashboardStatsQuerySchema>;
export declare const AuditLogQuerySchema: z.ZodObject<{
    entityType: z.ZodOptional<z.ZodString>;
    entityId: z.ZodOptional<z.ZodString>;
    actorUserId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    endDate?: string | undefined;
    entityType?: string | undefined;
    entityId?: string | undefined;
    actorUserId?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
    entityType?: string | undefined;
    entityId?: string | undefined;
    actorUserId?: string | undefined;
}>;
export type AuditLogQuery = z.infer<typeof AuditLogQuerySchema>;
//# sourceMappingURL=reporting.contracts.d.ts.map