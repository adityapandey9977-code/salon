import { createSuccessResponse } from '@salon-spa-saas/common-types';
import { AuditLogQuerySchema, DashboardStatsQuerySchema } from '@salon-spa-saas/contracts';
import { ReportingService } from '../../application/services/reporting.service';
export class ReportingController {
    static reportingService = new ReportingService();
    static async getDashboardStats(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || null;
            const query = DashboardStatsQuerySchema.safeParse(req.query);
            const stats = await ReportingController.reportingService.getDashboardStats(tenantId, query.success ? query.data : undefined);
            res.json(createSuccessResponse(stats));
        }
        catch (err) {
            next(err);
        }
    }
    static async getAuditLogs(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || null;
            const query = AuditLogQuerySchema.safeParse(req.query);
            const logs = await ReportingController.reportingService.getAuditLogs(tenantId, query.success ? query.data : undefined);
            res.json(createSuccessResponse(logs));
        }
        catch (err) {
            next(err);
        }
    }
}
