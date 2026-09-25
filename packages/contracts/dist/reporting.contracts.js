import { z } from 'zod';
export const DashboardStatsQuerySchema = z.object({
    branchId: z.string().uuid().optional(),
    franchiseId: z.string().uuid().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const AuditLogQuerySchema = z.object({
    entityType: z.string().optional(),
    entityId: z.string().uuid().optional(),
    actorUserId: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});
