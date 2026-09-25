import { TelephonyService } from '../../application/services/telephony.service';
const telephonyService = new TelephonyService();
export class TelephonyController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new Error('Tenant ID required');
        }
        return tenantId;
    }
    static async listAgents(req, res, next) {
        try {
            const tenantId = TelephonyController.getTenantId(req);
            const agents = await telephonyService.listAgents(tenantId);
            res.json({ success: true, data: agents });
        }
        catch (err) {
            next(err);
        }
    }
    static async listCalls(req, res, next) {
        try {
            const tenantId = TelephonyController.getTenantId(req);
            const calls = await telephonyService.listCalls(tenantId, req.query);
            res.json({ success: true, data: calls });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCallById(req, res, next) {
        try {
            const tenantId = TelephonyController.getTenantId(req);
            const call = await telephonyService.getCallById(tenantId, req.params.id);
            res.json({ success: true, data: call });
        }
        catch (err) {
            next(err);
        }
    }
    static async recordDisposition(req, res, next) {
        try {
            const tenantId = TelephonyController.getTenantId(req);
            const updated = await telephonyService.recordDisposition(tenantId, req.params.id, req.body);
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCustomerContext(req, res, next) {
        try {
            const tenantId = TelephonyController.getTenantId(req);
            const phone = req.query.phone || '+919876543210';
            const context = await telephonyService.getCustomerContext(tenantId, phone);
            res.json({ success: true, data: context });
        }
        catch (err) {
            next(err);
        }
    }
}
