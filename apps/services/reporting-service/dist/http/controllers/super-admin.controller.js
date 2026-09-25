import { DashboardService } from '../../application/services/dashboard.service';
import { AuditService } from '../../application/services/audit.service';
export class SuperAdminController {
    static async getKpis(_req, res, next) {
        try {
            const data = await DashboardService.getSuperAdminKpis();
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getMrrTelemetry(_req, res, next) {
        try {
            const data = await DashboardService.getSuperAdminMrrTelemetry();
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getTenantHealth(_req, res, next) {
        try {
            const data = await DashboardService.getSuperAdminTenantHealth();
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getSystemMetrics(_req, res, next) {
        try {
            const data = await DashboardService.getSuperAdminSystemMetrics();
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAudit(req, res, next) {
        try {
            const data = await AuditService.queryAuditLogs({
                tenantId: req.query.tenantId,
                entityType: req.query.entityType,
                action: req.query.action,
                category: req.query.category,
                search: req.query.search,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                limit: req.query.limit ? Number(req.query.limit) : 50,
                offset: req.query.offset ? Number(req.query.offset) : 0,
            });
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async createAuditLog(req, res, next) {
        try {
            const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
            const userAgent = req.headers['user-agent'];
            const data = await AuditService.createAuditLog({
                ...req.body,
                ipAddress: req.body.ipAddress || (typeof clientIp === 'string' ? clientIp : Array.isArray(clientIp) ? clientIp[0] : '127.0.0.1'),
                userAgent: req.body.userAgent || userAgent || 'Platform Web Client',
            });
            res.status(201).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async exportAudit(req, res, next) {
        try {
            const data = await AuditService.exportAuditLogs({
                tenantId: req.body.tenantId,
                category: req.body.category,
                search: req.body.search,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            });
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
}
