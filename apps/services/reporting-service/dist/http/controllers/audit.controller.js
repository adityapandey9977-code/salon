import { AuditService } from '../../application/services/audit.service';
export class AuditController {
    static async getAuditLogs(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || undefined;
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const entityType = req.query.entityType;
            const entityId = req.query.entityId;
            const actorUserId = req.query.actorUserId;
            const action = req.query.action;
            const category = req.query.category;
            const search = req.query.search;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const limit = req.query.limit ? Number(req.query.limit) : 50;
            const offset = req.query.offset ? Number(req.query.offset) : 0;
            const data = await AuditService.queryAuditLogs({
                tenantId,
                branchId,
                entityType,
                entityId,
                actorUserId,
                action,
                category,
                search,
                startDate,
                endDate,
                limit,
                offset,
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
            const tenantId = req.headers['x-tenant-id'] || req.body.tenantId;
            const branchId = req.headers['x-branch-id'] || req.body.branchId;
            const data = await AuditService.createAuditLog({
                ...req.body,
                tenantId,
                branchId,
                ipAddress: req.body.ipAddress || (typeof clientIp === 'string' ? clientIp : Array.isArray(clientIp) ? clientIp[0] : '127.0.0.1'),
                userAgent: req.body.userAgent || userAgent || 'Web Client',
            });
            res.status(201).json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async exportAuditLogs(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.body.tenantId || undefined;
            const category = req.body.category;
            const search = req.body.search;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const data = await AuditService.exportAuditLogs({ tenantId, category, search, startDate, endDate });
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
}
